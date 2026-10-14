# نشر المينيو على GitHub Pages

## النشر المعتاد

1. ارفع التعديلات إلى فرع `main`، بما فيها مجلد `.github/workflows`.
2. افتح إعدادات المستودع: **Settings → Pages → Build and deployment → Source** واختر **GitHub Actions**.
3. من **Actions** شغّل **Deploy menu to GitHub Pages**، أو ارفع تعديلًا جديدًا إلى `main`.
4. انتظر نجاح خطوة Deploy، ثم افتح الرابط الذي تعرضه الخطوة.

المستودع الحالي: https://github.com/elfaidydev/Aynma-menu
رابط المينيو: https://elfaidydev.github.io/Aynma-menu/

يبني الـworkflow نسخة ثابتة في `out/` وينشرها. يقرأ مسار Pages من إعدادات GitHub، لذلك يدعم نطاقًا مخصصًا أو مستودعًا بمسار مختلف بدون تغيير مسارات الصور يدويًا.

## تجربة نسخة Pages محليًا

```sh
npm ci
npm run build:pages
```

يستخدم هذا الأمر `/Aynma-menu` افتراضيًا خارج GitHub. لخدمة الملفات محليًا، يجب وضع محتوى `out/` تحت نفس المسار على خادم ملفات ثابتة؛ لا تستخدم `next start` مع نسخة Pages.

إذا كنت تنشر على جذر نطاق مخصص:

```sh
NEXT_PUBLIC_BASE_PATH='' npm run build:pages
```

ولمسار مختلف:

```sh
NEXT_PUBLIC_BASE_PATH='/repository-name' npm run build:pages
```

للتطوير المحلي المعتاد استخدم `npm run dev`. إعدادات `npm run build` و`npm start` العادية لا تزال تعمل مع خادم Next.js.

## سبب اختفاء الصور سابقًا

الصفحة المنشورة تحت `/Aynma-menu/` كانت تطلب `/assets/...` من جذر النطاق، فتعود الصورة بخطأ 404. صور المنتجات والأيقونات وتسجيل Service Worker الآن تستخدم مسار النشر الصحيح. رمز الريال يمر عبر تجميع CSS، والـmanifest يستخدم مسارات نسبية. نسخة Pages لا تعتمد على خادم تحسين صور Next.js؛ تحمل الصور كملفات ثابتة.

لا ترفع مجلد `.next` أو النسخة القديمة في `dist` إلى Pages. المجلد الصحيح هو `out` الناتج من `npm run build:pages`، والـworkflow ينشره تلقائيًا. إذا استمر عرض نسخة قديمة بعد نجاح النشر، اعمل تحديثًا إجباريًا مرة واحدة.
