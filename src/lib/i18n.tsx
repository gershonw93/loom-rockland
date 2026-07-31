"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "es" | "ht" | "fa";

// Native, full names shown in the language switcher (no ISO codes).
export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "ht", label: "Kreyòl Ayisyen", dir: "ltr" },
  { code: "fa", label: "فارسی", dir: "rtl" },
];

export function localeDir(l: Locale): "ltr" | "rtl" {
  return LOCALES.find((x) => x.code === l)?.dir ?? "ltr";
}

type Dict = Record<string, string>;

const en: Dict = {
  "nav.apply": "Apply Today",
  "announce.text": "A free program for {b} in New York",
  "announce.b": "Medicaid members",
  "badge.text": "{n} families approved by the Loom network",

  "hero.title1": "A Helping",
  "hero.title2": "Hand Delivered",
  "hero.sub": "Weekly Meal Boxes & Support Services",
  "hero.badge": "100% Free · For Medicaid members",
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
    "Weekly meal boxes & support services for Medicaid members in New York. Benefits and eligibility depend on program requirements.",
  "footer.serving": "Serving Medicaid Members in New York",
  "footer.contact": "Contact",
  "footer.note": "A project by NYC4C.ORG · © LOOM Social Care Network",
  "footer.linksTitle": "Quick Links",
  "footer.home": "Home",
  "footer.about": "About Us",
  "footer.privacy": "Privacy Policy",
  "footer.faq": "FAQ",
  "footer.enroll": "Enroll Now",
  "footer.how": "How it works",
  "footer.qualify": "Who Qualifies",
  "footer.services": "Our Services",
  "footer.contactUs": "Contact Us",
  "footer.rights":
    "© 2026 LOOM Social Care Network. All rights reserved.",

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
  "s3.title": "Select the health condition that applies to you",
  "s3.hint": "Select all that apply. (Optional)",
  "s3.helper":
    "Help us approve your application faster! Declaring health conditions and attaching documents allows us to determine eligibility immediately.",
  "cond.detailsTitle": "Condition details",
  "cond.clientName": "Client name",
  "cond.clientNameHint": "Name of the person this condition applies to",
  "cond.miscarriageDate": "Date of miscarriage",
  "cond.infantName": "Infant's name",
  "cond.infantDob": "Infant's date of birth",
  "cond.otherDoc": "Supporting document (preferred)",
  "f.family": "Number of family members (including you)",

  "s4.eyebrow": "Insurance",
  "s4.title": "Insurance information",
  "s4.hint":
    "Upload a photo of your insurance card to get approved faster — or enter your Medicaid ID (CIN) number below.",
  "s4.fasterBadge": "⚡ Approved faster",
  "s4.uploadLabel": "Upload your insurance card (Recommended for Faster Approval)",
  "s4.orLabel": "Or enter your Medicaid ID (CIN)",
  "s4.pathTitle": "How would you like to proceed?",
  "s4.pathFast": "Fast Approval Path (Provide Medicaid info now)",
  "s4.pathStandard": "Standard Path (Provide info to the officer later)",
  "s4.standardMsg":
    "No problem! Our enrollment officer will collect this information during your call.",
  "f.cinOptional": "Medicaid CIN (Optional)",
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
  "f.memberCin": "Medicaid ID# (CIN)",
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

  "ok.title": "Application received!",
  "ok.formNumberLabel": "Your application number",
  "ok.body":
    "Please keep your phone handy and make sure to answer so we can complete your application.",
  "ok.body2":
    "You've successfully completed the initial application! Great job. Your information is safely received.",
  "ok.body3":
    "The final step is a quick, required conversation with an Enrollment Officer from the LOOM office to verify everything and finalize your enrollment. An Enrollment Officer will call you within the next 48 hours.",
  "ok.back": "Back to home",
  "share.title":
    "Thank you for your application! Help a friend or neighbor get approved. Share Loom Rockland with them!",
  "share.subtitle": "",
  "share.whatsapp": "Share on WhatsApp",
  "share.native": "Share",
  "share.copyLink": "Copy link",
  "share.copied": "Copied!",
  "share.msg":
    "I found an excellent free fresh food delivery service for NYC residents (eligible for Medicaid). It's sponsored by the state and does NOT affect Food Stamps. I registered and it seems great. I highly recommend you check if you're eligible too: https://loomrockland.org/",
  "share.tplEmailTitle": "Email template",
  "share.tplEmailSubjectLabel": "Subject",
  "share.tplEmailSubject":
    "Recommended: Free Fresh Food Delivery Service for NYC Residents",
  "share.tplEmailBody":
    "Hello friend,\n\nI wanted to share an excellent initiative from the NYS Social Care Network providing free fresh food delivered to your door. It is available to NYC residents eligible for Medicaid, and it does NOT affect Food Stamps (SNAP).\n\nI registered, and the process was quick. Check your eligibility and sign up here: https://loomrockland.org/\n\nBest regards,",
  "share.tplSmsTitle": "SMS / WhatsApp template",
  "share.tplSmsBody":
    "I found an excellent free fresh food delivery service for NYC residents (eligible for Medicaid). It's sponsored by the state and does NOT affect Food Stamps. I registered and it seems great. I highly recommend you check if you're eligible too: https://loomrockland.org/",
  "share.copyEmail": "Copy email",
  "share.copyMsg": "Copy message",

  "err.eligibility": "Please select at least one eligibility category.",
  "err.generic": "Something went wrong. Please try again.",
  "err.failed": "Submission failed.",
  "err.tooBig": '"{name}" is larger than 10 MB.',
};

const es: Dict = {
  "nav.apply": "Solicitar hoy",
  "announce.text": "Un programa gratuito para {b} en Nueva York",
  "announce.b": "miembros de Medicaid",
  "badge.text": "{n} familias aprobadas por la red de Loom",

  "hero.title1": "Una mano",
  "hero.title2": "amiga a tu puerta",
  "hero.sub": "Cajas de comida semanales y servicios de apoyo",
  "hero.badge": "100% Gratis · Para miembros de Medicaid",
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
    "Cajas de comida semanales y servicios de apoyo para miembros de Medicaid en Nueva York. Los beneficios y la elegibilidad dependen de los requisitos del programa.",
  "footer.serving": "Sirviendo a miembros de Medicaid en Nueva York",
  "footer.contact": "Contacto",
  "footer.note": "Un proyecto de NYC4C.ORG · © LOOM Social Care Network",
  "footer.linksTitle": "Enlaces rápidos",
  "footer.home": "Inicio",
  "footer.about": "Sobre nosotros",
  "footer.privacy": "Política de privacidad",
  "footer.faq": "Preguntas frecuentes",
  "footer.enroll": "Inscríbete ahora",
  "footer.how": "Cómo funciona",
  "footer.qualify": "Quién califica",
  "footer.services": "Nuestros servicios",
  "footer.contactUs": "Contáctanos",
  "footer.rights":
    "© 2026 LOOM Social Care Network. Todos los derechos reservados.",

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
  "s3.title": "Selecciona la condición de salud que aplica a ti",
  "s3.hint": "Selecciona todas las que apliquen. (Opcional)",
  "s3.helper":
    "¡Ayúdanos a aprobar tu solicitud más rápido! Declarar condiciones de salud y adjuntar documentos nos permite determinar tu elegibilidad de inmediato.",
  "cond.detailsTitle": "Detalles de la condición",
  "cond.clientName": "Nombre del cliente",
  "cond.clientNameHint": "Nombre de la persona a la que aplica esta condición",
  "cond.miscarriageDate": "Fecha del aborto espontáneo",
  "cond.infantName": "Nombre del bebé",
  "cond.infantDob": "Fecha de nacimiento del bebé",
  "cond.otherDoc": "Documento de apoyo (preferido)",
  "f.family": "Número de miembros de la familia (incluyéndote)",

  "s4.eyebrow": "Seguro",
  "s4.title": "Información del seguro",
  "s4.hint":
    "Sube una foto de tu tarjeta de seguro para que te aprueben más rápido — o ingresa tu número de identificación de Medicaid (CIN) abajo.",
  "s4.fasterBadge": "⚡ Aprobación más rápida",
  "s4.uploadLabel": "Sube tu tarjeta de seguro (Recomendado para aprobación más rápida)",
  "s4.orLabel": "O ingresa tu identificación de Medicaid (CIN)",
  "s4.pathTitle": "¿Cómo te gustaría continuar?",
  "s4.pathFast": "Vía de aprobación rápida (Proporcionar info de Medicaid ahora)",
  "s4.pathStandard": "Vía estándar (Proporcionar la info al oficial después)",
  "s4.standardMsg":
    "¡No hay problema! Nuestro oficial de inscripción recopilará esta información durante tu llamada.",
  "f.cinOptional": "CIN de Medicaid (Opcional)",
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
  "f.memberCin": "Identificación de Medicaid (CIN)",
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

  "ok.title": "¡Solicitud recibida!",
  "ok.formNumberLabel": "Tu número de solicitud",
  "ok.body":
    "Por favor, ten tu teléfono a la mano y asegúrate de contestar para que podamos completar tu solicitud.",
  "ok.body2":
    "¡Has completado con éxito la solicitud inicial! Buen trabajo. Tu información se recibió de forma segura.",
  "ok.body3":
    "El último paso es una conversación rápida y obligatoria con un Oficial de Inscripción de la oficina de LOOM para verificar todo y finalizar tu inscripción. Un Oficial de Inscripción te llamará dentro de las próximas 48 horas.",
  "ok.back": "Volver al inicio",
  "share.title":
    "¡Gracias por tu solicitud! Ayuda a un amigo o vecino a ser aprobado. ¡Comparte Loom Rockland con ellos!",
  "share.subtitle": "",
  "share.whatsapp": "Compartir por WhatsApp",
  "share.native": "Compartir",
  "share.copyLink": "Copiar enlace",
  "share.copied": "¡Copiado!",
  "share.msg":
    "Encontré un excelente servicio gratuito de entrega de comida fresca para residentes de NYC (elegibles para Medicaid). Está patrocinado por el estado y NO afecta los cupones de alimentos (SNAP). Me registré y parece excelente. Te recomiendo mucho que verifiques si también eres elegible: https://loomrockland.org/",
  "share.tplEmailTitle": "Plantilla de correo",
  "share.tplEmailSubjectLabel": "Asunto",
  "share.tplEmailSubject":
    "Recomendado: Servicio gratuito de entrega de comida fresca para residentes de NYC",
  "share.tplEmailBody":
    "Hola amigo,\n\nQuería compartir una excelente iniciativa de la NYS Social Care Network que ofrece comida fresca gratis entregada en tu puerta. Está disponible para residentes de NYC elegibles para Medicaid, y NO afecta los cupones de alimentos (SNAP).\n\nMe registré y el proceso fue rápido. Verifica tu elegibilidad e inscríbete aquí: https://loomrockland.org/\n\nSaludos,",
  "share.tplSmsTitle": "Plantilla de SMS / WhatsApp",
  "share.tplSmsBody":
    "Encontré un excelente servicio gratuito de entrega de comida fresca para residentes de NYC (elegibles para Medicaid). Está patrocinado por el estado y NO afecta los cupones de alimentos. Me registré y parece excelente. Te recomiendo mucho que verifiques si también eres elegible: https://loomrockland.org/",
  "share.copyEmail": "Copiar correo",
  "share.copyMsg": "Copiar mensaje",

  "err.eligibility": "Por favor selecciona al menos una categoría de elegibilidad.",
  "err.generic": "Algo salió mal. Inténtalo de nuevo.",
  "err.failed": "El envío falló.",
  "err.tooBig": '"{name}" supera los 10 MB.',

  "elig.pregnant": "Embarazada",
  "elig.miscarriage": "Tuvo un aborto espontáneo",
  "elig.postpartum": "Posparto (últimos 12 meses)",
  "elig.substance_use": "Trastorno por uso de sustancias",
  "elig.hiv_aids": "VIH / SIDA",
  "elig.diabetes": "Diabetes",
  "elig.hypertension": "Hipertensión",
  "elig.smi": "Enfermedad mental grave (SMI)",
  "elig.chronic": "Condición crónica",
  "elig.other": "Otra",
};

const ht: Dict = {
  "nav.apply": "Aplike Jodi a",
  "announce.text": "Yon pwogram gratis pou {b} nan New York",
  "announce.b": "manm Medicaid",
  "badge.text": "{n} fanmi apwouve pa rezo Loom",

  "hero.title1": "Yon Men",
  "hero.title2": "Èd Livre Lakay Ou",
  "hero.sub": "Bwat Manje Chak Semèn ak Sèvis Sipò",
  "hero.badge": "100% Gratis · Pou manm Medicaid",
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
    "Bwat manje chak semèn ak sèvis sipò pou manm Medicaid nan New York. Benefis ak kalifikasyon depann de kondisyon pwogram nan.",
  "footer.serving": "N ap sèvi manm Medicaid nan New York",
  "footer.contact": "Kontak",
  "footer.note": "Yon pwojè NYC4C.ORG · © LOOM Social Care Network",
  "footer.linksTitle": "Lyen rapid",
  "footer.home": "Akèy",
  "footer.about": "Konsènan nou",
  "footer.privacy": "Règleman sou vi prive",
  "footer.faq": "Kesyon yo poze souvan",
  "footer.enroll": "Enskri kounye a",
  "footer.how": "Kijan li mache",
  "footer.qualify": "Kiyès ki kalifye",
  "footer.services": "Sèvis nou yo",
  "footer.contactUs": "Kontakte nou",
  "footer.rights":
    "© 2026 LOOM Social Care Network. Tout dwa rezève.",

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
  "s3.title": "Chwazi kondisyon sante ki aplike a ou",
  "s3.hint": "Chwazi tout sa ki aplikab. (Opsyonèl)",
  "s3.helper":
    "Ede nou apwouve aplikasyon w pi vit! Deklare kondisyon sante epi tache dokiman pèmèt nou detèmine kalifikasyon w touswit.",
  "cond.detailsTitle": "Detay kondisyon an",
  "cond.clientName": "Non kliyan an",
  "cond.clientNameHint": "Non moun kondisyon sa a aplike a",
  "cond.miscarriageDate": "Dat foskouch la",
  "cond.infantName": "Non tibebe a",
  "cond.infantDob": "Dat nesans tibebe a",
  "cond.otherDoc": "Dokiman sipò (pi bon)",
  "f.family": "Kantite manm fanmi (avèk ou ladann)",

  "s4.eyebrow": "Asirans",
  "s4.title": "Enfòmasyon asirans",
  "s4.hint":
    "Telechaje yon foto kat asirans ou pou yo apwouve w pi vit — oswa antre nimewo ID Medicaid (CIN) ou anba a.",
  "s4.fasterBadge": "⚡ Apwouve pi vit",
  "s4.uploadLabel": "Telechaje kat asirans ou (Rekòmande pou apwobasyon pi vit)",
  "s4.orLabel": "Oswa antre ID Medicaid (CIN) ou",
  "s4.pathTitle": "Kijan ou vle kontinye?",
  "s4.pathFast": "Chemen apwobasyon rapid (Bay enfo Medicaid kounye a)",
  "s4.pathStandard": "Chemen estanda (Bay enfo bay ofisye a pita)",
  "s4.standardMsg":
    "Pa gen pwoblèm! Ofisye enskripsyon nou an ap kolekte enfòmasyon sa a pandan apèl ou a.",
  "f.cinOptional": "CIN Medicaid (Opsyonèl)",
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
  "f.memberCin": "ID Medicaid (CIN)",
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

  "ok.title": "Nou resevwa aplikasyon an!",
  "ok.formNumberLabel": "Nimewo aplikasyon w",
  "ok.body":
    "Tanpri kenbe telefòn ou toupre epi asire w ou reponn pou nou ka konplete aplikasyon w.",
  "ok.body2":
    "Ou fè premye aplikasyon an avèk siksè! Bèl travay. Nou resevwa enfòmasyon w yo an sekirite.",
  "ok.body3":
    "Dènye etap la se yon ti konvèsasyon rapid ki obligatwa ak yon Ofisye Enskripsyon nan biwo LOOM pou verifye tout bagay epi finalize enskripsyon w. Yon Ofisye Enskripsyon ap rele w nan pwochen 48 èdtan.",
  "ok.back": "Tounen nan akèy",
  "share.title":
    "Mèsi pou aplikasyon w! Ede yon zanmi oswa yon vwazen jwenn apwobasyon. Pataje Loom Rockland avèk yo!",
  "share.subtitle": "",
  "share.whatsapp": "Pataje sou WhatsApp",
  "share.native": "Pataje",
  "share.copyLink": "Kopye lyen",
  "share.copied": "Kopye!",
  "share.msg":
    "Mwen jwenn yon bon sèvis gratis ki livre manje fre pou rezidan NYC (ki kalifye pou Medicaid). Se leta ki peye pou li epi li PA afekte Food Stamps (SNAP). Mwen enskri epi li sanble trè bon. Mwen rekòmande w tcheke si ou kalifye tou: https://loomrockland.org/",
  "share.tplEmailTitle": "Modèl imèl",
  "share.tplEmailSubjectLabel": "Sijè",
  "share.tplEmailSubject":
    "Rekòmande: Sèvis gratis pou livre manje fre pou rezidan NYC",
  "share.tplEmailBody":
    "Bonjou zanmi,\n\nMwen te vle pataje yon bèl inisyativ NYS Social Care Network ki bay manje fre gratis livre devan pòt ou. Li disponib pou rezidan NYC ki kalifye pou Medicaid, epi li PA afekte Food Stamps (SNAP).\n\nMwen enskri, epi pwosesis la te rapid. Tcheke kalifikasyon w epi enskri isit la: https://loomrockland.org/\n\nBon vwayaj,",
  "share.tplSmsTitle": "Modèl SMS / WhatsApp",
  "share.tplSmsBody":
    "Mwen jwenn yon bon sèvis gratis ki livre manje fre pou rezidan NYC (ki kalifye pou Medicaid). Se leta ki peye pou li epi li PA afekte Food Stamps. Mwen enskri epi li sanble trè bon. Mwen rekòmande w tcheke si ou kalifye tou: https://loomrockland.org/",
  "share.copyEmail": "Kopye imèl",
  "share.copyMsg": "Kopye mesaj",

  "err.eligibility": "Tanpri chwazi omwen yon kategori kalifikasyon.",
  "err.generic": "Yon bagay pa mache. Tanpri eseye ankò.",
  "err.failed": "Aplikasyon an pa t voye.",
  "err.tooBig": '"{name}" pi gwo pase 10 MB.',

  "elig.pregnant": "Ansent",
  "elig.miscarriage": "Te fè yon foskouch",
  "elig.postpartum": "Apre akouchman (12 dènye mwa)",
  "elig.substance_use": "Twoub itilizasyon sibstans",
  "elig.hiv_aids": "VIH / SIDA",
  "elig.diabetes": "Dyabèt",
  "elig.hypertension": "Tansyon wo",
  "elig.smi": "Maladi mantal grav (SMI)",
  "elig.chronic": "Kondisyon kwonik",
  "elig.other": "Lòt",
};

const fa: Dict = {
  "nav.apply": "امروز ثبت‌نام کنید",
  "announce.text": "یک برنامه رایگان برای {b} در نیویورک",
  "announce.b": "اعضای مدیکید",
  "badge.text": "{n} خانواده توسط شبکه Loom تأیید شده‌اند",

  "hero.title1": "یک دست",
  "hero.title2": "یاری، درِ خانه شما",
  "hero.sub": "جعبه‌های غذای هفتگی و خدمات پشتیبانی",
  "hero.badge": "۱۰۰٪ رایگان · برای اعضای مدیکید",
  "hero.apply": "امروز ثبت‌نام کنید ←",
  "hero.how": "چطور کار می‌کند",

  "how.eyebrow": "چطور کار می‌کند",
  "how.title": "ما آن را ساده می‌کنیم.",
  "how.s1t": "در ثبت‌نام کمکتان می‌کنیم",
  "how.s1d": "یک فرم کوتاه پر کنید. تیم ما به شما در ثبت‌نام کمک می‌کند و واجد شرایط بودنتان را تأیید می‌کند.",
  "how.s2t": "جعبه‌های تازه، هر هفته",
  "how.s2d": "جعبه‌های غذای مغذی هر هفته درِ خانه شما تحویل داده می‌شود — کاملاً رایگان.",
  "how.s3t": "پشتیبانی دوستانه",
  "how.s3d": "از ابتدا تا انتها همراه شما هستیم، با پشتیبانی دلسوزانه هر زمان که نیاز داشته باشید.",

  "qual.eyebrow": "چه کسانی واجد شرایط هستند؟",
  "qual.title": "پشتیبانی برای کسانی که بیش از همه نیاز دارند.",
  "qual.lead":
    "اگر شما یا یکی از اعضای خانواده‌تان با هر یک از این موارد روبرو هستید، ممکن است واجد شرایط دریافت جعبه‌های غذای هفتگی و خدمات پشتیبانی باشید.",
  "qual.imgalt": "یک جعبه غذای هفتگی LOOM",

  "check.1": "در ثبت‌نام به شما کمک می‌کنیم",
  "check.2": "جعبه‌های غذای تازه به‌صورت هفتگی تحویل داده می‌شود",
  "check.3": "پشتیبانی دوستانه از ابتدا تا انتها",

  "cta.title": "آماده شروع هستید؟",
  "cta.text":
    "فقط چند دقیقه طول می‌کشد. یک نماینده تیم مراقبت LOOM طی ۲۴ تا ۴۸ ساعت با شما تماس می‌گیرد تا ثبت‌نامتان را نهایی کند.",
  "cta.btn": "درخواست خود را شروع کنید ←",

  "footer.tagline":
    "جعبه‌های غذای هفتگی و خدمات پشتیبانی برای اعضای مدیکید در نیویورک. مزایا و واجد شرایط بودن به الزامات برنامه بستگی دارد.",
  "footer.serving": "در خدمت اعضای مدیکید در نیویورک",
  "footer.contact": "تماس",
  "footer.note": "پروژه‌ای از NYC4C.ORG · © LOOM Social Care Network",
  "footer.linksTitle": "پیوندهای سریع",
  "footer.home": "خانه",
  "footer.about": "درباره ما",
  "footer.privacy": "سیاست حفظ حریم خصوصی",
  "footer.faq": "سؤالات متداول",
  "footer.enroll": "همین حالا ثبت‌نام کنید",
  "footer.how": "چطور کار می‌کند",
  "footer.qualify": "چه کسانی واجد شرایط هستند",
  "footer.services": "خدمات ما",
  "footer.contactUs": "تماس با ما",
  "footer.rights": "© ۲۰۲۶ LOOM Social Care Network. تمامی حقوق محفوظ است.",

  "chip.pregnancy": "بارداری یا پس از زایمان",
  "chip.food": "ناامنی غذایی",
  "chip.housing": "ناامنی مسکن",
  "chip.chronic": "دیابت و فشار خون",
  "chip.heart": "بیماری‌های قلبی",
  "chip.mental": "مشکلات سلامت روان",
  "chip.develop": "ناتوانی‌های رشدی",
  "chip.physical": "ناتوانی‌های جسمی",
  "chip.medicaid": "اعضای مدیکید",
  "chip.assistance": "SNAP / WIC / SSI / TANF",

  "step.referral": "معرفی",
  "step.details": "اطلاعات شما",
  "step.eligibility": "واجد شرایط بودن",
  "step.insurance": "بیمه",
  "wiz.progress": "مرحله {n} از {total} · {step}",
  "wiz.medicaid":
    "{b} برای تکمیل ثبت‌نام به شناسه مدیکید (CIN) یا کارت بیمه خود نیاز دارید.",
  "wiz.medicaidB": "این برنامه برای اعضای مدیکید است.",
  "wiz.refBadge": "✓ شما از طریق معرفی یک نماینده LOOM درخواست می‌دهید.",
  "wiz.home": "→ خانه",

  "s1.eyebrow": "معرفی",
  "s1.title": "چه کسی شما را معرفی کرد؟",
  "s1.hint": "به ما بگویید چه کسی درباره LOOM به شما گفت تا از او تشکر کنیم.",
  "s1.label": "چه کسی شما را معرفی کرد؟",
  "s1.placeholder": "نام شخص یا نماینده‌ای که شما را معرفی کرد",

  "s2.eyebrow": "اطلاعات شما",
  "s2.title": "درباره خودتان به ما بگویید",
  "s2.hint": "جعبه‌های غذا را کجا تحویل دهیم؟",
  "f.firstName": "نام",
  "f.lastName": "نام خانوادگی",
  "f.dob": "تاریخ تولد",
  "f.address": "آدرس تحویل جعبه‌های غذا",
  "f.street": "آدرس خیابان",
  "f.unit": "آپارتمان / واحد (اختیاری)",
  "f.city": "شهر",
  "f.state": "ایالت",
  "f.zip": "کد پستی",
  "f.phone": "شماره تلفن همراه (برای تماس و پیامک)",
  "f.phonePh": "+1 (845) 000-0000",

  "s3.eyebrow": "واجد شرایط بودن",
  "s3.title": "وضعیت سلامتی که به شما مربوط می‌شود را انتخاب کنید",
  "s3.hint": "همه موارد مرتبط را انتخاب کنید. (اختیاری)",
  "s3.helper":
    "به ما کمک کنید درخواستتان را سریع‌تر تأیید کنیم! اعلام وضعیت سلامتی و پیوست مدارک به ما اجازه می‌دهد واجد شرایط بودن شما را فوراً تعیین کنیم.",
  "cond.detailsTitle": "جزئیات وضعیت",
  "cond.clientName": "نام مراجع",
  "cond.clientNameHint": "نام شخصی که این وضعیت به او مربوط می‌شود",
  "cond.miscarriageDate": "تاریخ سقط جنین",
  "cond.infantName": "نام نوزاد",
  "cond.infantDob": "تاریخ تولد نوزاد",
  "cond.otherDoc": "مدرک پشتیبان (ترجیحاً)",
  "f.family": "تعداد اعضای خانواده (شامل خودتان)",

  "s4.eyebrow": "بیمه",
  "s4.title": "اطلاعات بیمه",
  "s4.hint":
    "برای تأیید سریع‌تر، عکسی از کارت بیمه خود بارگذاری کنید — یا شماره شناسه مدیکید (CIN) خود را در زیر وارد کنید.",
  "s4.fasterBadge": "⚡ تأیید سریع‌تر",
  "s4.uploadLabel": "کارت بیمه خود را بارگذاری کنید (توصیه‌شده برای تأیید سریع‌تر)",
  "s4.orLabel": "یا شناسه مدیکید (CIN) خود را وارد کنید",
  "s4.pathTitle": "چگونه می‌خواهید ادامه دهید؟",
  "s4.pathFast": "مسیر تأیید سریع (ارائه اطلاعات مدیکید همین حالا)",
  "s4.pathStandard": "مسیر استاندارد (ارائه اطلاعات به مأمور در آینده)",
  "s4.standardMsg":
    "مشکلی نیست! مأمور ثبت‌نام ما این اطلاعات را طی تماس با شما جمع‌آوری می‌کند.",
  "f.cinOptional": "شناسه مدیکید (اختیاری)",
  "f.photos": "عکس‌های کارت بیمه",
  "f.photosHint":
    "لطفاً عکس کارت بیمه خود و همه اعضای خانواده ذکرشده در این درخواست را بارگذاری کنید.",
  "f.dropzone": "برای انتخاب فایل کلیک کنید یا آن را اینجا بکشید",
  "f.cin": "شماره شناسه مدیکید (CIN) — در صورت نبود عکس",
  "f.cinHint": "در صورت داشتن، شناسه مدیکید (CIN) متقاضی اصلی را وارد کنید.",
  "f.cinPh": "شماره CIN مدیکید {n}",
  "f.cinPlain": "شناسه مدیکید (CIN)",
  "f.cinApplicant": "شناسه مدیکید (CIN) متقاضی اصلی",
  "f.addCin": "+ افزودن CIN دیگر",

  "members.title": "افزودن اعضای خانواده",
  "members.hint":
    "شما {n} نفر را در خانوار خود ذکر کردید. لطفاً هر عضو اضافی خانواده را در زیر اضافه کنید.",
  "members.label": "عضو خانواده {n}",
  "f.fullName": "نام کامل",
  "f.relationship": "نسبت",
  "f.memberCin": "شماره شناسه مدیکید (CIN)",
  "rel.select": "انتخاب کنید…",
  "rel.husband": "همسر (شوهر)",
  "rel.wife": "همسر (زن)",
  "rel.child": "فرزند",
  "rel.mother": "مادر",
  "rel.parent": "والد",
  "rel.other": "سایر",

  "ins.note":
    "{b} شما همان Member ID / CIN# است که روی کارت بیمه‌تان چاپ شده — برای مثال، {ex}. یک عکس واضح از کارت بگیرید، یا شماره را در زیر تایپ کنید. محل آن روی کارت‌های رایج در اینجاست:",
  "ins.noteB": "شناسه مدیکید (CIN)",
  "ins.cap1": "پایین سمت راست: «CIN#»",
  "ins.cap2": "روی کارت: «ID Number»",
  "ins.cap3": "زیر نام: «Member ID»",

  "btn.continue": "ادامه ←",
  "btn.back": "→ بازگشت",
  "btn.submit": "ارسال درخواست",
  "btn.submitting": "در حال ارسال…",

  "ok.title": "درخواست دریافت شد!",
  "ok.formNumberLabel": "شماره درخواست شما",
  "ok.body":
    "لطفاً تلفن خود را در دسترس نگه دارید و حتماً پاسخ دهید تا بتوانیم درخواست شما را تکمیل کنیم.",
  "ok.body2":
    "شما با موفقیت درخواست اولیه را تکمیل کردید! آفرین. اطلاعات شما با اطمینان دریافت شد.",
  "ok.body3":
    "مرحله آخر یک گفت‌وگوی کوتاه و الزامی با یک مأمور ثبت‌نام از دفتر LOOM است تا همه چیز بررسی و ثبت‌نام شما نهایی شود. یک مأمور ثبت‌نام طی ۴۸ ساعت آینده با شما تماس می‌گیرد.",
  "ok.back": "بازگشت به خانه",
  "share.title":
    "از درخواست شما متشکریم! به یک دوست یا همسایه کمک کنید تأیید شود. Loom Rockland را با آن‌ها به اشتراک بگذارید!",
  "share.subtitle": "",
  "share.whatsapp": "اشتراک در واتساپ",
  "share.native": "اشتراک‌گذاری",
  "share.copyLink": "کپی لینک",
  "share.copied": "کپی شد!",
  "share.msg":
    "یک سرویس عالی و رایگان تحویل غذای تازه برای ساکنان نیویورک (واجد شرایط مدیکید) پیدا کردم. توسط ایالت حمایت می‌شود و روی Food Stamps تأثیری ندارد. ثبت‌نام کردم و عالی به نظر می‌رسد. اکیداً توصیه می‌کنم بررسی کنید که آیا شما هم واجد شرایط هستید: https://loomrockland.org/",
  "share.tplEmailTitle": "قالب ایمیل",
  "share.tplEmailSubjectLabel": "موضوع",
  "share.tplEmailSubject":
    "توصیه‌شده: سرویس رایگان تحویل غذای تازه برای ساکنان نیویورک",
  "share.tplEmailBody":
    "سلام دوست عزیز،\n\nمی‌خواستم یک ابتکار عالی از NYS Social Care Network را با شما به اشتراک بگذارم که غذای تازه رایگان را درِ خانه شما تحویل می‌دهد. برای ساکنان نیویورک که واجد شرایط مدیکید هستند در دسترس است و روی Food Stamps (SNAP) تأثیری ندارد.\n\nثبت‌نام کردم و فرآیند سریع بود. واجد شرایط بودن خود را بررسی کنید و اینجا ثبت‌نام کنید: https://loomrockland.org/\n\nبا احترام،",
  "share.tplSmsTitle": "قالب پیامک / واتساپ",
  "share.tplSmsBody":
    "یک سرویس عالی و رایگان تحویل غذای تازه برای ساکنان نیویورک (واجد شرایط مدیکید) پیدا کردم. توسط ایالت حمایت می‌شود و روی Food Stamps تأثیری ندارد. ثبت‌نام کردم و عالی به نظر می‌رسد. اکیداً توصیه می‌کنم بررسی کنید که آیا شما هم واجد شرایط هستید: https://loomrockland.org/",
  "share.copyEmail": "کپی ایمیل",
  "share.copyMsg": "کپی پیام",

  "err.eligibility": "لطفاً حداقل یک دسته واجد شرایط بودن را انتخاب کنید.",
  "err.generic": "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  "err.failed": "ارسال ناموفق بود.",
  "err.tooBig": "«{name}» بزرگ‌تر از ۱۰ مگابایت است.",

  "elig.pregnant": "باردار",
  "elig.miscarriage": "سقط جنین داشته",
  "elig.postpartum": "پس از زایمان (۱۲ ماه اخیر)",
  "elig.substance_use": "اختلال مصرف مواد",
  "elig.hiv_aids": "اچ‌آی‌وی / ایدز",
  "elig.diabetes": "دیابت",
  "elig.hypertension": "فشار خون بالا",
  "elig.smi": "بیماری روانی شدید (SMI)",
  "elig.chronic": "بیماری مزمن",
  "elig.other": "سایر",
};

const DICTS: Record<Locale, Dict> = { en, es, ht, fa };

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}>({ locale: "en", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always default to English on a fresh visit. We deliberately do NOT restore
  // from localStorage or auto-detect the browser language, so every new visitor
  // (and every new browsing session) starts in English. The choice is kept in
  // sessionStorage only, so it carries across pages within the same visit but is
  // never remembered for the next visitor.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = sessionStorage.getItem("loom_locale") as Locale | null;
    if (saved && DICTS[saved]) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = localeDir(saved);
    }
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    try {
      sessionStorage.setItem("loom_locale", l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
    document.documentElement.dir = localeDir(l);
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
