import 'server-only';

/**
 * Gutschein-PDF via @react-pdf/renderer: A5 quer, Holz-Look als Vektor-SVG
 * (das CSS-Rezept aus GiftVoucher.tsx in SVG übersetzt — Gradient-Grund,
 * Dielenfugen, feine Maserung, dunkles Overlay). Wird deterministisch aus
 * der gift_cards-Row regeneriert, nicht gespeichert.
 */
import path from 'path';
import {
  Document,
  Image,
  LinearGradient,
  Page,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
  Defs,
  renderToBuffer,
} from '@react-pdf/renderer';
import { STRINGS } from '@/lib/i18n/strings';
import { isLocale, type Locale } from '@/lib/i18n/config';
import type { GiftCard } from './types';

const C = {
  night: '#0f1813',
  cream: '#faf7f1',
  creamSoft: '#f3ede2',
  brass: '#c9a96a',
  brassDark: '#a6863f',
};

// A5 quer in pt (Seite füllt der Holz-Hintergrund randlos).
const W = 595.28;
const H = 419.53;

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', color: C.cream },
  bg: { position: 'absolute', top: 0, left: 0 },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: W,
    height: H,
    paddingVertical: 30,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  brand: { fontSize: 17, fontFamily: 'Times-Roman', color: C.cream },
  brandSub: {
    fontSize: 6.5,
    letterSpacing: 3,
    color: C.creamSoft,
    marginTop: 3,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  icon: { width: 46, height: 46, marginTop: 12, borderRadius: 23 },
  eyebrow: {
    fontSize: 7.5,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    color: C.brass,
    marginTop: 10,
  },
  amount: { fontSize: 46, fontFamily: 'Times-Roman', color: C.cream, marginTop: 6 },
  names: { fontSize: 10.5, color: C.creamSoft, marginTop: 10 },
  message: {
    fontSize: 9.5,
    fontFamily: 'Times-Italic',
    color: C.creamSoft,
    marginTop: 8,
    maxWidth: 360,
    textAlign: 'center',
    lineHeight: 1.5,
    opacity: 0.95,
  },
  codeBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.brass,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(15, 24, 19, 0.35)',
  },
  codeLabel: {
    fontSize: 6,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: C.brass,
    textAlign: 'center',
  },
  code: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    color: C.cream,
    marginTop: 3,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 26,
    left: 48,
    right: 48,
    alignItems: 'center',
  },
  footerRule: { width: 34, height: 0.8, backgroundColor: C.brassDark, marginBottom: 8 },
  footerText: { fontSize: 7, color: C.creamSoft, opacity: 0.85, lineHeight: 1.6, textAlign: 'center' },
});

const eur = (cents: number) => `${(cents / 100).toFixed(2).replace(/[.,]00$/, '').replace('.', ',')} €`;

/** Holz-Look: Gradient-Grund + Dielenfugen + Maserung + Lesbarkeits-Overlay. */
function WoodBackground() {
  const planks: React.ReactElement[] = [];
  // Horizontale Dielenfugen (Karte quer → liegende Bretter), alle ~70 pt.
  for (let y = 70; y < H; y += 70) {
    planks.push(<Rect key={`p${y}`} x={0} y={y} width={W} height={1.6} fill="#000000" opacity={0.32} />);
    planks.push(<Rect key={`pl${y}`} x={0} y={y + 1.6} width={W} height={0.8} fill="#ffffff" opacity={0.03} />);
  }
  // Feine Maserung: unregelmäßige vertikale Linien in sehr niedriger Deckkraft.
  const grain: React.ReactElement[] = [];
  for (let x = 3, i = 0; x < W; x += i % 2 === 0 ? 5 : 11, i++) {
    grain.push(
      <Rect key={`g${x}`} x={x} y={0} width={0.7} height={H} fill={i % 3 === 0 ? '#000000' : '#ffffff'} opacity={i % 3 === 0 ? 0.05 : 0.02} />,
    );
  }
  return (
    <Svg style={s.bg} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5d4029" />
          <Stop offset="1" stopColor="#382616" />
        </LinearGradient>
        <LinearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={C.night} stopOpacity={0.55} />
          <Stop offset="0.45" stopColor={C.night} stopOpacity={0.34} />
          <Stop offset="1" stopColor={C.night} stopOpacity={0.62} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill="url('#wood')" />
      {grain}
      {planks}
      <Rect x={0} y={0} width={W} height={H} fill="url('#shade')" />
    </Svg>
  );
}

const dateFmt = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(
    locale === 'de' ? 'de-DE' : locale === 'zh' ? 'zh-CN' : locale === 'ar' ? 'ar' : 'en-GB',
    { day: '2-digit', month: '2-digit', year: 'numeric' },
  );

function GiftCardDoc({ card }: { card: GiftCard }) {
  const locale: Locale = isLocale(card.locale) ? card.locale : 'de';
  const t = STRINGS[locale].giftFlow.card;
  const iconPath = path.join(process.cwd(), 'public', 'images', 'giftcard', `${card.elementIcon}.png`);

  return (
    <Document title={`${t.eyebrow} ${card.code}`} author="Black Forest Retreats">
      <Page size="A5" orientation="landscape" style={s.page}>
        <WoodBackground />
        <View style={s.content}>
          <Text style={s.brand}>Black Forest Retreats</Text>
          <Text style={s.brandSub}>Neuenbürg</Text>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf-Image kennt kein alt */}
          <Image style={s.icon} src={iconPath} />
          <Text style={s.eyebrow}>{t.eyebrow}</Text>
          <Text style={s.amount}>{eur(card.amountCents)}</Text>
          <Text style={s.names}>
            {t.forLabel} {card.recipientName}  ·  {t.fromLabel} {card.buyerName}
          </Text>
          {card.message ? <Text style={s.message}>„{card.message}“</Text> : null}
          <View style={s.codeBox}>
            <Text style={s.codeLabel}>{t.codeLabel}</Text>
            <Text style={s.code}>{card.code}</Text>
          </View>
        </View>
        <View style={s.footer}>
          <View style={s.footerRule} />
          <Text style={s.footerText}>
            {card.expiresAt ? t.validUntil(dateFmt(card.expiresAt, locale)) : t.validity}
            {'\n'}
            {t.redeemHint}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderGiftCardPdf(card: GiftCard): Promise<Buffer> {
  return renderToBuffer(<GiftCardDoc card={card} />);
}
