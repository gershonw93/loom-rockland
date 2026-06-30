"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "es" | "ht";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "ht", label: "Kreyòl Ayisyen", short: "HT" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.apply": "Apply Today",
  "announce.text": "A free program for {b} in Rockland County",
  "announce.b": "Medicaid members",

  "hero.title1": "A Helping",
  "hero.title2": "Hand Delivered",
  "hero.sub": "Weekly Meal Boxes & Support Services",
  "hero.badge": "Free for Medicaid members · Rockland County",
  "hero.apply": "Apply Today →",
  "hero.how": "How it works",

  "how.eyebrow": "How it works",
  "how.title": "We make it simple.",
  "how.s1t": "We help you apply",
  "how.s1d": "Fill out one short form. Our team helps you sign up and confirms your eligibility.",
  "how.s2t": "Fresh boxes, weekly",
  "how.s2d": "Nutritious meal boxes are delivered to your door every week — no cost to you.",
  "how.s3t": "Friendly support",
  "how.s3d": "We're with you from start to finish, with caring support whenever you need it.",

  "qual.eyebrow": "Who qualifies?",
  "qual.title": "Support for those who need it most.",
  "qual.lead":
    "If you or a family member faces any of these, you may be eligible for weekly meal boxes and support services.",
  "qual.imgalt": "A weekly LOOM meal box",

  "check.1": "We help you apply and sign up",
  "check.2": "Fresh meal boxes delivered weekly",
  "check.3": "Friendly support from start to finish",

  "cta.title": "Ready to get started?",
  "cta.text":
    "It takes just a few minutes. A LOOM Care Team representative will reach out within 24–48 hours to finalize your enrollment.",
  "cta.btn": "Start your application →",

  "footer.tagline":
    "Weekly meal boxes & support services for Rockland County families. Benefits and eligibility depend on program requirements.",
  "footer.serving": "Serving Rockland County, NY",
  "footer.contact": "Contact",
  "footer.note": "A project by NYC4C.ORG · © LOOM Social Care Network",

  // chips (who qualifies)
  "chip.pregnancy": "Pregnancy or postpartum",
  "chip.food": "Food insecurity",
  "chip.housing": "Housing insecurity",
  "chip.chronic": "Diabetes & hypertension",
  "chip.heart": "Heart conditions",
  "chip.mental": "Mental health challenges",
  "chip.develop": "Developmental disabilities",
  "chip.physical": "Physical disabilities",
  "chip.medicaid": "Medicaid members",
  "chip.assistance": "SNAP / WIC / SSI / TANF",

  // wizard
  "step.referral": "Referral",
  "step.details": "Your details",
  "step.eligibility": "Eligibility",
  "step.insurance": "Insurance",
  "wiz.progress": "Step {n} of {total} · {step}",
  "wiz.medicaid":
    "{b} You'll need your Medicaid ID (CIN) or insurance card to complete enrollment.",
  "wiz.medicaidB": "This program is for Medicaid members.",
  "wiz.refBadge": "✓ You're applying through a LOOM agent referral.",
  "wiz.home": "← Home",

  "s1.eyebrow": "Referral",
  "s1.title": "Who referred you?",
  "s1.hint": "Let us know who told you about LOOM so we can thank them.",
  "s1.label": "Who referred you?",
  "s1.placeholder": "Name of the person or agent who referred you",

  "s2.eyebrow": "Your details",
  "s2.title": "Tell us about you",
  "s2.hint": "Where should we deliver your meal boxes?",
  "f.firstName": "First Name",
  "f.lastName": "Last Name",
  "f.dob": "Date of Birth",
  "f.address": "Food Boxes Delivery Address",
  "f.street": "Street address",
  "f.unit": "Apt / Unit (optional)",
  "f.city": "City",
  "f.state": "State",
  "f.zip": "ZIP",
  "f.phone": "Cell Phone Number (for calls and texts)",
  "f.phonePh": "+1 (845) 000-0000",

  "s3.eyebrow": "Eligibility",
  "s3.title": "What brings you to LOOM?",
  "s3.hint": "Select all that apply.",
  "f.family": "Number of family members (including you)",

  "s4.eyebrow": "Insurance",
  "s4.title": "Insurance information",
  "s4.hint":
    "Upload a photo of your insurance card to get approved faster — or enter your Medicaid ID (CIN) number below.",
  "s4.fasterBadge": "⚡ Approved faster",
  "s4.uploadLabel": "Upload your insurance card (recommended)",
  "s4.orLabel": "Or enter your Medicaid ID (CIN)",
  "f.photos": "Insurance Card Photos",
  "f.photosHint":
    "Please upload photos of insurance cards for yourself and all family members listed in this application.",
  "f.dropzone": "Click to choose a file or drag here",
  "f.cin": "Medicaid ID# (CIN) — if no photos",
  "f.cinHint": "Enter the main applicant's Medicaid CIN, if you have it.",
  "f.cinPh": "Medicaid CIN #{n}",
  "f.cinPlain": "Medicaid CIN",
  "f.cinApplicant": "Main applicant's Medicaid CIN",
  "f.addCin": "+ Add another CIN",

  "members.title": "Add family members",
  "members.hint":
    "You listed {n} people in your household. Please add each additional family member below.",
  "members.label": "Family member {n}",
  "f.fullName": "Full Name",
  "f.relationship": "Relationship",
  "f.memberCin": "Medicaid ID# (CIN) — if no photo",
  "rel.select": "Select…",
  "rel.husband": "Husband",
  "rel.wife": "Wife",
  "rel.child": "Child",
  "rel.mother": "Mother",
  "rel.parent": "Parent",
  "rel.other": "Other",

  "ins.note":
    "Your {b} is the Member ID / CIN# printed on your insurance card — for example, {ex}. Snap a clear photo of the card, or type the number below. Here's where to look on common cards:",
  "ins.noteB": "Medicaid ID (CIN)",
  "ins.cap1": "Bottom-right: “CIN#”",
  "ins.cap2": "Front: “ID Number”",
  "ins.cap3": "Under name: “Member ID”",

  "btn.continue": "Continue →",
  "btn.back": "← Back",
  "btn.submit": "Submit application",
  "btn.submitting": "Submitting…",

  "ok.title": "Thank you for your application!",
  "ok.formNumberLabel": "Your application number",
  "ok.body":
    "Your information has been received securely. A LOOM Care Team representative will contact you within 24–48 hours to finalize your enrollment and schedule your home support.",
  "ok.back": "Back to home",

  "err.eligibility": "Please select at least one eligibility category.",
  "err.generic": "Something went wrong. Please try again.",
  "err.failed": "Submission failed.",
  "err.tooBig": '"{name}" is larger than 10 MB.',
};

const es: Dict = {
  "nav.apply": "Solicitar hoy",
  "announce.text": "Un programa gratuito para {b} en el condado de Rockland",
  "announce.b": "miembros de Medicaid",

  "hero.title1": "Una mano",
  "hero.title2": "amiga a tu puerta",
  "hero.sub": "Cajas de comida semanales y servicios de apoyo",
  "hero.badge": "Gratis para miembros de Medicaid · Condado de Rockland",
  "hero.apply": "Solicitar hoy →",
  "hero.how": "Cómo funciona",

  "how.eyebrow": "Cómo funciona",
  "how.title": "Lo hacemos fácil.",
  "how.s1t": "Te ayudamos a solicitar",
  "how.s1d": "Completa un formulario corto. Nuestro equipo te ayuda a inscribirte y confirma tu elegibilidad.",
  "how.s2t": "Cajas frescas, cada semana",
  "how.s2d": "Cajas de comida nutritiva se entregan en tu puerta cada semana, sin costo para ti.",
  "how.s3t": "Apoyo amable",
  "how.s3d": "Estamos contigo de principio a fin, con apoyo cuando lo necesites.",

  "qual.eyebrow": "¿Quién califica?",
  "qual.title": "Apoyo para quienes más lo necesitan.",
  "qual.lead":
    "Si tú o un familiar enfrenta alguna de estas situaciones, podrías ser elegible para cajas de comida semanales y servicios de apoyo.",
  "qual.imgalt": "Una caja de comida semanal de LOOM",

  "check.1": "Te ayudamos a solicitar e inscribirte",
  "check.2": "Cajas de comida fresca entregadas semanalmente",
  "check.3": "Apoyo amable de principio a fin",

  "cta.title": "¿Listo para empezar?",
  "cta.text":
    "Solo toma unos minutos. Un representante del Equipo de Cuidado de LOOM se comunicará contigo en 24–48 horas para finalizar tu inscripción.",
  "cta.btn": "Comienza tu solicitud →",

  "footer.tagline":
    "Cajas de comida semanales y servicios de apoyo para familias del condado de Rockland. Los beneficios y la elegibilidad dependen de los requisitos del programa.",
  "footer.serving": "Sirviendo al condado de Rockland, NY",
  "footer.contact": "Contacto",
  "footer.note": "Un proyecto de NYC4C.ORG · © LOOM Social Care Network",

  "chip.pregnancy": "Embarazo o posparto",
  "chip.food": "Inseguridad alimentaria",
  "chip.housing": "Inseguridad de vivienda",
  "chip.chronic": "Diabetes e hipertensión",
  "chip.heart": "Enfermedades del corazón",
  "chip.mental": "Salud mental",
  "chip.develop": "Discapacidades del desarrollo",
  "chip.physical": "Discapacidades físicas",
  "chip.medicaid": "Miembros de Medicaid",
  "chip.assistance": "SNAP / WIC / SSI / TANF",

  "step.referral": "Referencia",
  "step.details": "Tus datos",
  "step.eligibility": "Elegibilidad",
  "step.insurance": "Seguro",
  "wiz.progress": "Paso {n} de {total} · {step}",
  "wiz.medicaid":
    "{b} Necesitarás tu identificación de Medicaid (CIN) o tu tarjeta de seguro para completar la inscripción.",
  "wiz.medicaidB": "Este programa es para miembros de Medicaid.",
  "wiz.refBadge": "✓ Estás solicitando a través de la referencia de un agente de LOOM.",
  "wiz.home": "← Inicio",

  "s1.eyebrow": "Referencia",
  "s1.title": "¿Quién te refirió?",
  "s1.hint": "Dinos quién te habló de LOOM para poder agradecerle.",
  "s1.label": "¿Quién te refirió?",
  "s1.placeholder": "Nombre de la persona o agente que te refirió",

  "s2.eyebrow": "Tus datos",
  "s2.title": "Cuéntanos sobre ti",
  "s2.hint": "¿A dónde debemos entregar tus cajas de comida?",
  "f.firstName": "Nombre",
  "f.lastName": "Apellido",
  "f.dob": "Fecha de nacimiento",
  "f.address": "Dirección de entrega de las cajas",
  "f.street": "Dirección",
  "f.unit": "Apto / Unidad (opcional)",
  "f.city": "Ciudad",
  "f.state": "Estado",
  "f.zip": "Código postal",
  "f.phone": "Número de celular (para llamadas y mensajes)",
  "f.phonePh": "+1 (845) 000-0000",

  "s3.eyebrow": "Elegibilidad",
  "s3.title": "¿Qué te trae a LOOM?",
  "s3.hint": "Selecciona todas las que apliquen.",
  "f.family": "Número de miembros de la familia (incluyéndote)",

  "s4.eyebrow": "Seguro",
  "s4.title": "Información del seguro",
  "s4.hint":
    "Sube una foto de tu tarjeta de seguro para que te aprueben más rápido — o ingresa tu número de identificación de Medicaid (CIN) abajo.",
  "s4.fasterBadge": "⚡ Aprobación más rápida",
  "s4.uploadLabel": "Sube tu tarjeta de seguro (recomendado)",
  "s4.orLabel": "O ingresa tu identificación de Medicaid (CIN)",
  "f.photos": "Fotos de la tarjeta de seguro",
  "f.photosHint":
    "Por favor sube fotos de las tarjetas de seguro tuyas y de todos los familiares incluidos en esta solicitud.",
  "f.dropzone": "Haz clic para elegir un archivo o arrástralo aquí",
  "f.cin": "Identificación de Medicaid (CIN) — si no hay fotos",
  "f.cinHint": "Ingresa el CIN de Medicaid del solicitante principal, si lo tienes.",
  "f.cinPh": "CIN de Medicaid #{n}",
  "f.cinPlain": "CIN de Medicaid",
  "f.cinApplicant": "CIN de Medicaid del solicitante principal",
  "f.addCin": "+ Agregar otro CIN",

  "members.title": "Agregar familiares",
  "members.hint":
    "Indicaste {n} personas en tu hogar. Por favor agrega cada familiar adicional a continuación.",
  "members.label": "Familiar {n}",
  "f.fullName": "Nombre completo",
  "f.relationship": "Parentesco",
  "f.memberCin": "Identificación de Medicaid (CIN) — si no hay foto",
  "rel.select": "Selecciona…",
  "rel.husband": "Esposo",
  "rel.wife": "Esposa",
  "rel.child": "Hijo/a",
  "rel.mother": "Madre",
  "rel.other": "Otro",

  "ins.note":
    "Tu {b} es el Member ID / CIN# impreso en tu tarjeta de seguro — por ejemplo, {ex}. Toma una foto clara de la tarjeta, o escribe el número abajo. Aquí te mostramos dónde buscar en tarjetas comunes:",
  "ins.noteB": "identificación de Medicaid (CIN)",
  "ins.cap1": "Abajo a la derecha: “CIN#”",
  "ins.cap2": "Al frente: “ID Number”",
  "ins.cap3": "Debajo del nombre: “Member ID”",

  "btn.continue": "Continuar →",
  "btn.back": "← Atrás",
  "btn.submit": "Enviar solicitud",
  "btn.submitting": "Enviando…",

  "ok.title": "¡Gracias por tu solicitud!",
  "ok.formNumberLabel": "Tu número de solicitud",
  "ok.body":
    "Tu información se recibió de forma segura. Un representante del Equipo de Cuidado de LOOM te contactará en 24–48 horas para finalizar tu inscripción y programar tu apoyo a domicilio.",
  "ok.back": "Volver al inicio",

  "err.eligibility": "Por favor selecciona al menos una categoría de elegibilidad.",
  "err.generic": "Algo salió mal. Inténtalo de nuevo.",
  "err.failed": "El envío falló.",
  "err.tooBig": '"{name}" supera los 10 MB.',

  "elig.pregnancy": "Embarazo – Futuras madres",
  "elig.postpartum":
    "Posparto – Nuevas madres (generalmente hasta 1 año después del parto)",
  "elig.food_insecurity":
    "Inseguridad alimentaria – Dificultad para pagar o acceder a comida nutritiva",
  "elig.housing_insecurity":
    "Inseguridad de vivienda – En riesgo de desalojo, falta de vivienda o dificultad para pagar la renta",
  "elig.diabetes": "Diabetes – Controlar el azúcar en sangre mediante la dieta",
  "elig.hypertension":
    "Hipertensión – Presión arterial alta que requiere una nutrición saludable",
  "elig.heart_conditions":
    "Enfermedades del corazón – Apoyo para enfermedades cardíacas crónicas",
  "elig.obesity":
    "Obesidad – Necesidad de apoyo nutricional para el control de peso",
  "elig.mental_health":
    "Salud mental – Depresión, ansiedad u otros problemas de salud mental",
  "elig.developmental_disabilities":
    "Discapacidades del desarrollo – Autismo, síndrome de Down u otros retrasos",
  "elig.physical_disabilities":
    "Discapacidades físicas – Problemas de movilidad que afectan el acceso a la comida",
  "elig.substance_use":
    "Trastorno por uso de sustancias – Apoyo para personas en recuperación",
  "elig.medicaid_membership":
    "Membresía de Medicaid – Titulares de Healthfirst, Fidelis, United, etc.",
  "elig.public_assistance":
    "Asistencia pública – Personas que reciben SNAP, WIC, SSI o TANF",
};

const ht: Dict = {
  "nav.apply": "Aplike Jodi a",
  "announce.text": "Yon pwogram gratis pou {b} nan Konte Rockland",
  "announce.b": "manm Medicaid",

  "hero.title1": "Yon Men",
  "hero.title2": "Èd Livre Lakay Ou",
  "hero.sub": "Bwat Manje Chak Semèn ak Sèvis Sipò",
  "hero.badge": "Gratis pou manm Medicaid · Konte Rockland",
  "hero.apply": "Aplike Jodi a →",
  "hero.how": "Kijan li mache",

  "how.eyebrow": "Kijan li mache",
  "how.title": "Nou fè l fasil.",
  "how.s1t": "Nou ede w aplike",
  "how.s1d": "Ranpli yon sèl ti fòm. Ekip nou an ede w enskri epi konfime kalifikasyon w.",
  "how.s2t": "Bwat fre, chak semèn",
  "how.s2d": "Bwat manje ki bon pou sante livre devan pòt ou chak semèn — san okenn frè pou ou.",
  "how.s3t": "Sipò ki janti",
  "how.s3d": "Nou avèk ou depi nan kòmansman jiska lafen, ak sipò ki gen swen lè w bezwen l.",

  "qual.eyebrow": "Kiyès ki kalifye?",
  "qual.title": "Sipò pou moun ki bezwen l plis la.",
  "qual.lead":
    "Si ou menm oswa yon manm fanmi w ap fè fas ak youn nan sa yo, ou ka kalifye pou bwat manje chak semèn ak sèvis sipò.",
  "qual.imgalt": "Yon bwat manje LOOM chak semèn",

  "check.1": "Nou ede w aplike epi enskri",
  "check.2": "Bwat manje fre livre chak semèn",
  "check.3": "Sipò ki janti depi nan kòmansman jiska lafen",

  "cta.title": "Ou pare pou kòmanse?",
  "cta.text":
    "Li pran sèlman kèk minit. Yon reprezantan Ekip Swen LOOM ap kontakte w nan 24–48 èdtan pou fini enskripsyon w.",
  "cta.btn": "Kòmanse aplikasyon w →",

  "footer.tagline":
    "Bwat manje chak semèn ak sèvis sipò pou fanmi nan Konte Rockland. Benefis ak kalifikasyon depann de kondisyon pwogram nan.",
  "footer.serving": "N ap sèvi Konte Rockland, NY",
  "footer.contact": "Kontak",
  "footer.note": "Yon pwojè NYC4C.ORG · © LOOM Social Care Network",

  "chip.pregnancy": "Gwosès oswa apre akouchman",
  "chip.food": "Mank manje",
  "chip.housing": "Mank lojman",
  "chip.chronic": "Dyabèt ak tansyon",
  "chip.heart": "Maladi kè",
  "chip.mental": "Defi sante mantal",
  "chip.develop": "Andikap devlopman",
  "chip.physical": "Andikap fizik",
  "chip.medicaid": "Manm Medicaid",
  "chip.assistance": "SNAP / WIC / SSI / TANF",

  "step.referral": "Referans",
  "step.details": "Enfòmasyon w",
  "step.eligibility": "Kalifikasyon",
  "step.insurance": "Asirans",
  "wiz.progress": "Etap {n} sou {total} · {step}",
  "wiz.medicaid":
    "{b} W ap bezwen ID Medicaid ou (CIN) oswa kat asirans ou pou fini enskripsyon an.",
  "wiz.medicaidB": "Pwogram sa a se pou manm Medicaid.",
  "wiz.refBadge": "✓ W ap aplike atravè referans yon ajan LOOM.",
  "wiz.home": "← Akèy",

  "s1.eyebrow": "Referans",
  "s1.title": "Kiyès ki refere w?",
  "s1.hint": "Fè nou konnen kiyès ki pale w de LOOM pou nou ka di l mèsi.",
  "s1.label": "Kiyès ki refere w?",
  "s1.placeholder": "Non moun nan oswa ajan ki refere w la",

  "s2.eyebrow": "Enfòmasyon w",
  "s2.title": "Pale nou de ou",
  "s2.hint": "Ki kote nou dwe livre bwat manje w yo?",
  "f.firstName": "Prenon",
  "f.lastName": "Siyati",
  "f.dob": "Dat nesans",
  "f.address": "Adrès livrezon bwat manje yo",
  "f.street": "Adrès lari",
  "f.unit": "Apt / Inite (opsyonèl)",
  "f.city": "Vil",
  "f.state": "Eta",
  "f.zip": "Kòd postal",
  "f.phone": "Nimewo selilè (pou apèl ak tèks)",
  "f.phonePh": "+1 (845) 000-0000",

  "s3.eyebrow": "Kalifikasyon",
  "s3.title": "Kisa ki mennen w nan LOOM?",
  "s3.hint": "Chwazi tout sa ki aplikab.",
  "f.family": "Kantite manm fanmi (avèk ou ladann)",

  "s4.eyebrow": "Asirans",
  "s4.title": "Enfòmasyon asirans",
  "s4.hint":
    "Telechaje yon foto kat asirans ou pou yo apwouve w pi vit — oswa antre nimewo ID Medicaid (CIN) ou anba a.",
  "s4.fasterBadge": "⚡ Apwouve pi vit",
  "s4.uploadLabel": "Telechaje kat asirans ou (rekòmande)",
  "s4.orLabel": "Oswa antre ID Medicaid (CIN) ou",
  "f.photos": "Foto kat asirans",
  "f.photosHint":
    "Tanpri telechaje foto kat asirans pou ou menm ak tout manm fanmi ki nan aplikasyon sa a.",
  "f.dropzone": "Klike pou chwazi yon fichye oswa trennen l isit la",
  "f.cin": "ID Medicaid (CIN) — si pa gen foto",
  "f.cinHint": "Antre CIN Medicaid aplikan prensipal la, si ou genyen l.",
  "f.cinPh": "CIN Medicaid #{n}",
  "f.cinPlain": "CIN Medicaid",
  "f.cinApplicant": "CIN Medicaid aplikan prensipal la",
  "f.addCin": "+ Ajoute yon lòt CIN",

  "members.title": "Ajoute manm fanmi",
  "members.hint":
    "Ou make {n} moun nan kay ou. Tanpri ajoute chak lòt manm fanmi anba a.",
  "members.label": "Manm fanmi {n}",
  "f.fullName": "Non konplè",
  "f.relationship": "Relasyon",
  "f.memberCin": "ID Medicaid (CIN) — si pa gen foto",
  "rel.select": "Chwazi…",
  "rel.husband": "Mari",
  "rel.wife": "Madanm",
  "rel.child": "Pitit",
  "rel.mother": "Manman",
  "rel.other": "Lòt",

  "ins.note":
    "{b} ou se Member ID / CIN# ki enprime sou kat asirans ou — pa egzanp, {ex}. Pran yon foto klè nan kat la, oswa tape nimewo a anba a. Men kote pou w gade sou kat ki komen yo:",
  "ins.noteB": "ID Medicaid (CIN)",
  "ins.cap1": "Anba adwat: “CIN#”",
  "ins.cap2": "Devan: “ID Number”",
  "ins.cap3": "Anba non an: “Member ID”",

  "btn.continue": "Kontinye →",
  "btn.back": "← Tounen",
  "btn.submit": "Voye aplikasyon",
  "btn.submitting": "N ap voye…",

  "ok.title": "Mèsi pou aplikasyon w!",
  "ok.formNumberLabel": "Nimewo aplikasyon w",
  "ok.body":
    "Nou resevwa enfòmasyon w yo an sekirite. Yon reprezantan Ekip Swen LOOM ap kontakte w nan 24–48 èdtan pou fini enskripsyon w epi pwograme sipò lakay ou.",
  "ok.back": "Tounen nan akèy",

  "err.eligibility": "Tanpri chwazi omwen yon kategori kalifikasyon.",
  "err.generic": "Yon bagay pa mache. Tanpri eseye ankò.",
  "err.failed": "Aplikasyon an pa t voye.",
  "err.tooBig": '"{name}" pi gwo pase 10 MB.',

  "elig.pregnancy": "Gwosès – Manman ki ansent",
  "elig.postpartum":
    "Apre akouchman – Nouvo manman (anjeneral jiska 1 an apre akouchman)",
  "elig.food_insecurity":
    "Mank manje – Difikilte pou peye oswa jwenn manje ki bon pou sante",
  "elig.housing_insecurity":
    "Mank lojman – An risk pou degèpisman, sanzabri, oswa difikilte pou peye lwaye",
  "elig.diabetes": "Dyabèt – Jere sik nan san atravè rejim manje",
  "elig.hypertension":
    "Tansyon wo – Tansyon wo ki mande yon nitrisyon ki bon pou sante",
  "elig.heart_conditions": "Maladi kè – Sipò pou maladi kè kwonik",
  "elig.obesity": "Obezite – Bezwen sipò nitrisyonèl pou jere pwa",
  "elig.mental_health":
    "Defi sante mantal – Depresyon, enkyetid, oswa lòt pwoblèm sante mantal",
  "elig.developmental_disabilities":
    "Andikap devlopman – Otis, sendwòm Down, oswa lòt reta",
  "elig.physical_disabilities":
    "Andikap fizik – Pwoblèm mobilite ki afekte aksè ak manje",
  "elig.substance_use":
    "Twoub itilizasyon sibstans – Sipò pou moun k ap refè",
  "elig.medicaid_membership":
    "Manm Medicaid – Moun ki gen Healthfirst, Fidelis, United, elatriye",
  "elig.public_assistance":
    "Asistans Piblik – Moun k ap resevwa SNAP, WIC, SSI, oswa TANF",
};

const DICTS: Record<Locale, Dict> = { en, es, ht };

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}>({ locale: "en", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("loom_locale") as Locale | null;
    if (saved && DICTS[saved]) setLocaleState(saved);
    else {
      const nav = navigator.language?.slice(0, 2);
      if (nav === "es" || nav === "ht") setLocaleState(nav);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("loom_locale", l);
    document.documentElement.lang = l;
  }

  function t(key: string, vars?: Record<string, string | number>) {
    let s = DICTS[locale][key] ?? en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return s;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Localised eligibility label, falling back to the English DB label. */
export function eligLabel(
  t: (k: string) => string,
  value: string,
  fallback: string
) {
  const k = `elig.${value}`;
  const v = t(k);
  return v === k ? fallback : v;
}
