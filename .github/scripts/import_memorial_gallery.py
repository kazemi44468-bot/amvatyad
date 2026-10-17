import io, re, time, requests
from PIL import Image
from pathlib import Path

ROOT = Path("images/gallery")
ROOT.mkdir(parents=True, exist_ok=True)
API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {"User-Agent": "AmvatYadMemorialGallery/1.0 (memorial image archive; contact repository maintainer)"}
QUERIES = [
    "memorial flowers", "white flowers bouquet", "roses bouquet", "cemetery flowers",
    "flowers in garden", "lily flowers", "candles in dark", "flower arrangement",
    "sunrise garden", "peaceful garden flowers", "white rose", "purple flowers",
    "flowers with candle", "tombstone flowers", "green park flowers"
]
seen, records = set(), []
session = requests.Session()
def search(query):
    params = {"action":"query","format":"json","generator":"search","gsrsearch":query,
              "gsrnamespace":6,"gsrlimit":50,"prop":"imageinfo","iiprop":"url|extmetadata|mime",
              "iiurlwidth":1200}
    try:
        data=session.get(API,params=params,headers=HEADERS,timeout=35).json()
        return list((data.get("query",{}).get("pages") or {}).values())
    except Exception as exc:
        print("Search failed", query, exc); return []

for query in QUERIES:
    if len(records) >= 100: break
    added_this_query = 0
    for page in search(query):
        title=page.get("title","")
        if title in seen: continue
        seen.add(title)
        info=(page.get("imageinfo") or [{}])[0]
        meta=info.get("extmetadata") or {}
        mime=info.get("mime","")
        if not mime.startswith("image/"): continue
        def clean(value):
            return re.sub("<[^>]+>","",value or "")
        license_name=clean(meta.get("LicenseShortName",{}).get("value",""))
        license_url=clean(meta.get("LicenseUrl",{}).get("value",""))
        artist=clean(meta.get("Artist",{}).get("value",""))
        source=info.get("thumburl") or info.get("url")
        if not source: continue
        try:
            response=session.get(source,headers=HEADERS,timeout=40)
            response.raise_for_status()
            im=Image.open(io.BytesIO(response.content)).convert("RGB")
            if im.width < 500 or im.height < 350: continue
            im.thumbnail((1400,1400),Image.Resampling.LANCZOS)
            filename="gallery-%03d.jpg" % (len(records)+1)
            im.save(ROOT/filename,"JPEG",quality=88,optimize=True,progressive=True)
            records.append({"file":filename,"title":title,"artist":artist,"license":license_name,"license_url":license_url,"source":info.get("descriptionurl",""),"query":query})
            added_this_query += 1
            print("%d/100 %s %s" % (len(records),filename,title))
            if len(records)>=100 or added_this_query>=8: break
        except Exception as exc:
            print("Skip",title,exc)
        time.sleep(.08)

if len(records)<100:
    raise SystemExit("Only %d valid images downloaded; refusing to publish an incomplete 100-image archive." % len(records))
lines=["# منابع و مجوز تصاویر آرشیو اموات یاد","","تصاویر از Wikimedia Commons دریافت شده‌اند. شرایط مجوز هر فایل باید هنگام بازنشر رعایت شود.",""]
for r in records:
    lines += ["## "+r["file"],"- فایل: images/gallery/"+r["file"],"- عنوان منبع: "+r["title"],"- پدیدآور: "+(r["artist"] or "در صفحه منبع درج نشده"),"- مجوز: "+(r["license"] or "در صفحه منبع بررسی شود"),"- پیوند مجوز: "+(r["license_url"] or "در صفحه منبع بررسی شود"),"- منبع: "+r["source"],"- عبارت جست‌وجو: "+r["query"],""]
Path("images/GALLERY-CREDITS.md").write_text("\n".join(lines),encoding="utf-8")
