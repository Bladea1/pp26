/** Фото-обложки в стиле макетов (grunge / glitch) */
const asset = (file) => `/assets/${file}`;

export const IMG = {
  hero: asset("home-hero.jpg"),
  sampleBag: asset("sample-bag.jpg"),
  mutationPanel: asset("mutation-panel.jpg"),
  mutationFace: asset("mutation-face.jpg"),
  reagentPink: asset("reagent-pink.jpg"),
  statueHome: asset("statue-home.jpg"),
  aboutStatue: asset("about-statue.jpg"),
  formPreview: asset("form-preview.jpg"),
  journalFlower: asset("journal-flower.jpg"),
  journalHero: asset("journal-hero.jpg"),
  journalEye: asset("article-eye.jpg"),
  reagentScan: asset("reagent-scan.jpg"),
  reagentMap: asset("reagent-map.jpg"),
  profileAvatar: asset("profile-avatar.jpg"),
  aboutSteps: {
    step1: asset("about-step-01.jpg"),
    step2: asset("about-step-02.jpg"),
    step3: asset("about-step-03.jpg"),
    step4: asset("about-step-04.jpg")
  },
  aboutCta: asset("about-cta-join.jpg"),
  projects: {
    bessonnitsa: asset("card-bessonnitsa.jpg"),
    mgnoveniya: asset("card-mgnoveniya.jpg"),
    gorod: asset("card-gorod.jpg"),
    substrat: asset("card-substrat.jpg"),
    interfeys: asset("card-interfeys.jpg"),
    kollektiv: asset("card-kollektiv.jpg"),
    neyro: asset("card-neyro.jpg"),
    sboy: asset("card-sboy.jpg")
  }
};
