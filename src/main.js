import "./style.css";

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

const DISTRICTS = {
  "الرياض": ["الملقا", "النرجس", "الياسمين", "حطين", "العارض", "الصحافة", "القيروان", "الندى", "الربيع", "العقيق", "الورود", "السليمانية", "الروضة", "المونسية", "قرطبة", "اليرموك", "الحمراء", "الرمال", "النخيل", "الملز"],
  "الخبر": ["العقربية", "الراكة الشمالية", "الراكة الجنوبية", "الحزام الذهبي", "اليرموك", "الخبر الشمالية", "الثقبة", "العليا", "البندرية", "الكورنيش", "الجسر", "الحمراء"],
  "الدمام": ["الشاطئ", "الفيصلية", "النور", "الفيحاء", "المزروعية", "الريان", "الجلوية", "أحد", "الشعلة", "الضباب", "البادية", "الروضة"],
  "الظهران": ["الدوحة الشمالية", "الدوحة الجنوبية", "القصور", "الجامعة", "تلال الدوحة", "هجر", "الحزام الأخضر"],
};

const form = document.getElementById("leadForm");
const $ = (id) => document.getElementById(id);
const val = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || "";
const show = (el, on) => el.classList.toggle("hidden", !on);
const err = (key) => form.querySelector(`[data-err="${key}"]`);

function fillDistricts() {
  const key = val("المنطقة") === "الرياض" ? "الرياض" : val("المدينة");
  const list = key ? DISTRICTS[key] : Object.values(DISTRICTS).flat();
  $("districts").innerHTML = [...new Set(list)].map((d) => `<option value="${d}"></option>`).join("");
}

form.addEventListener("change", (e) => {
  const n = e.target.name;
  if (n === "المنطقة") {
    show($("eastCities"), val("المنطقة") === "المنطقة الشرقية");
    if (val("المنطقة") === "الرياض") form.querySelectorAll('input[name="المدينة"]').forEach((i) => (i.checked = false));
    show(err("region"), false);
  }
  if (n === "المنطقة" || n === "المدينة") fillDistricts();
  if (n === "نوع الطلب") {
    show($("rentBox"), val("نوع الطلب") === "إيجار");
    show(err("type"), false);
  }
  if (n === "الغرف") show($("roomsOther"), val("الغرف") === "other");
  if (n === "نوع الإيجار") show($("rentTypeOther"), val("نوع الإيجار") === "other");
  if (e.target.id === "duration") show($("durationOther"), e.target.value === "other");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = $("phone").value.replace(/[\s-]/g, "").replace(/^\+?966/, "0");
  const okPhone = /^05\d{8}$/.test(phone);
  const okRegion = !!val("المنطقة");
  const okType = !!val("نوع الطلب");
  show(err("phone"), !okPhone);
  show(err("region"), !okRegion);
  show(err("type"), !okType);
  $("phone").classList.toggle("border-red-400", !okPhone);
  if (!okPhone || !okRegion || !okType) {
    form.querySelector("[data-err]:not(.hidden)")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const rooms = val("الغرف") === "other" ? $("roomsOther").value.trim() : val("الغرف");
  const rent = val("نوع الطلب") === "إيجار";
  const duration = $("duration").value === "other" ? $("durationOther").value.trim() : $("duration").value;
  const rentType = val("نوع الإيجار") === "other" ? $("rentTypeOther").value.trim() || "غير ذلك" : val("نوع الإيجار");
  const lines = [
    "طلب عقاري جديد - فدن العقارية",
    "",
    ["الاسم", $("name").value.trim()],
    ["الجنس", val("الجنس")],
    ["الجوال", phone],
    ["المنطقة", val("المنطقة")],
    ["المدينة", val("المدينة")],
    ["الحي", $("district").value.trim()],
    ["نوع الطلب", val("نوع الطلب")],
    ["عدد الغرف", rooms],
    rent && ["مدة الإيجار", duration],
    rent && ["التأثيث", val("التأثيث")],
    rent && ["نوع الإيجار", rentType],
    ["متطلبات أخرى", $("notes").value.trim()],
  ]
    .filter((l) => typeof l === "string" || (l && l[1]))
    .map((l) => (typeof l === "string" ? l : `${l[0]}: ${l[1]}`));
  window.open(`https://wa.me/966538602877?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  show(form, false);
  show($("thanks"), true);
  $("thanks").scrollIntoView({ behavior: "smooth", block: "center" });
});

$("again").addEventListener("click", () => {
  form.reset();
  ["eastCities", "rentBox", "roomsOther", "durationOther", "rentTypeOther"].forEach((id) => show($(id), false));
  fillDistricts();
  show($("thanks"), false);
  show(form, true);
});

fillDistricts();
