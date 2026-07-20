"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const SITE = "https://loomrockland.org";

function Icon({ path, size = 22 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const WHATSAPP =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.893a11.821 11.821 0 00-3.495-8.42";
const TELEGRAM =
  "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const FACEBOOK =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const MESSENGER =
  "M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z";

export function ShareCard() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const msg = t("share.msg");
  const encMsg = encodeURIComponent(msg);
  const encUrl = encodeURIComponent(SITE);

  const whatsapp = `https://wa.me/?text=${encMsg}`;
  const telegram = `https://t.me/share/url?url=${encUrl}&text=${encMsg}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
  const messenger = `fb-messenger://share/?link=${encUrl}`;

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Loom Rockland", text: msg, url: SITE });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SITE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="share-card">
      <h3 className="share-title">{t("share.title")}</h3>
      <p className="share-sub">{t("share.subtitle")}</p>

      <a className="btn-whatsapp" href={whatsapp} target="_blank" rel="noreferrer">
        <Icon path={WHATSAPP} size={22} />
        {t("share.whatsapp")}
      </a>

      <div className="share-row">
        <a
          className="share-circle tg"
          href={telegram}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
        >
          <Icon path={TELEGRAM} />
        </a>
        <a
          className="share-circle fb"
          href={facebook}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <Icon path={FACEBOOK} />
        </a>
        <a className="share-circle msg" href={messenger} aria-label="Messenger">
          <Icon path={MESSENGER} />
        </a>
      </div>

      <div className="share-utils">
        <button type="button" className="share-util" onClick={nativeShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {t("share.native")}
        </button>
        <button type="button" className="share-util" onClick={copyLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? t("share.copied") : t("share.copyLink")}
        </button>
      </div>
    </div>
  );
}
