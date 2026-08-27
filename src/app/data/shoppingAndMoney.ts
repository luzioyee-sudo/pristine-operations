// @ts-nocheck
export interface TopicItemRow {
  english: string;
  arabic: string;
  french: string;
  german: string;
  spanish: string;
  type: 'word' | 'chunk' | 'sentence';
  cefr: 'A1' | 'A2';
  pos?: string;
  phonetic?: {
    english?: string;
    french?: string;
    german?: string;
    spanish?: string;
    arabic?: string;
  };
}

export const SHOPPING_AND_MONEY_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY & FINANCIAL / RETAIL TERMS =====================
  {
    english: 'money',
    arabic: 'المال',
    french: 'argent',
    german: 'Geld',
    spanish: 'dinero',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmʌni/',
      french: '/aʁ.ʒɑ̃/',
      german: '/ɡɛlt/',
      spanish: '/diˈneɾo/'
    }
  },
  {
    english: 'cash',
    arabic: 'نقدًا',
    french: 'espèces/argent liquide',
    german: 'Bargeld',
    spanish: 'efectivo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kæʃ/',
      french: '/ɛs.pɛs/',
      german: '/ˈbaːɐ̯ˌɡɛlt/',
      spanish: '/efekˈtiβo/'
    }
  },
  {
    english: 'coin',
    arabic: 'عملة معدنية',
    french: 'pièce (de monnaie)',
    german: 'Münze',
    spanish: 'moneda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kɔɪn/',
      french: '/pjɛs/',
      german: '/ˈmʏntsə/',
      spanish: '/moˈneða/'
    }
  },
  {
    english: 'banknote / bill',
    arabic: 'ورقة نقدية',
    french: 'billet',
    german: 'Geldschein',
    spanish: 'billete',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbæŋknoʊt / bɪl/',
      french: '/bi.jɛ/',
      german: '/ˈɡɛltˌʃaɪn/',
      spanish: '/biˈʎete/'
    }
  },
  {
    english: 'credit card',
    arabic: 'بطاقة ائتمان',
    french: 'carte de crédit',
    german: 'Kreditkarte',
    spanish: 'tarjeta de crédito',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkrɛdɪt kɑːrd/',
      french: '/kaʁt də kʁe.di/',
      german: '/kʁeˈdiːtˌkaʁtə/',
      spanish: '/taɾˈxeta ðe ˈkɾeðito/'
    }
  },
  {
    english: 'debit card',
    arabic: 'بطاقة خصم مباشر',
    french: 'carte de débit',
    german: 'Debitkarte/EC-Karte',
    spanish: 'tarjeta de débito',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɛbɪt kɑːrd/',
      french: '/kaʁt də de.bi/',
      german: '/ˈdeːbɪtˌkaʁtə/',
      spanish: '/taɾˈxeta ðe ˈdeβito/'
    }
  },
  {
    english: 'wallet',
    arabic: 'محفظة',
    french: 'portefeuille',
    german: 'Geldbeutel/Portemonnaie',
    spanish: 'cartera/billetera',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɒlɪt/',
      french: '/pɔʁt.fœj/',
      german: '/ˈɡɛltˌbɔɪtl̩/',
      spanish: '/kaɾˈteɾa/'
    }
  },
  {
    english: 'price',
    arabic: 'السعر',
    french: 'prix',
    german: 'Preis',
    spanish: 'precio',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/praɪs/',
      french: '/pʁi/',
      german: '/pʁaɪs/',
      spanish: '/ˈpɾesjo/'
    }
  },
  {
    english: 'cost',
    arabic: 'التكلفة',
    french: 'coût',
    german: 'Kosten',
    spanish: 'costo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kɒst/',
      french: '/ku/',
      german: '/ˈkɔstn̩/',
      spanish: '/ˈkosto/'
    }
  },
  {
    english: 'expensive',
    arabic: 'غالي',
    french: 'cher/chère',
    german: 'teuer',
    spanish: 'caro/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ɪkˈspɛnsɪv/',
      french: '/ʃɛʁ/',
      german: '/ˈtɔɪ̯ɐ/',
      spanish: '/ˈkaɾo/'
    }
  },
  {
    english: 'cheap',
    arabic: 'رخيص',
    french: 'bon marché/pas cher',
    german: 'billig',
    spanish: 'barato/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/tʃiːp/',
      french: '/bɔ̃ maʁ.ʃe/',
      german: '/ˈbɪlɪç/',
      spanish: '/baˈɾato/'
    }
  },
  {
    english: 'affordable',
    arabic: 'بسعر معقول',
    french: 'abordable',
    german: 'erschwinglich',
    spanish: 'asequible',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/əˈfɔːrdəbl̩/',
      french: '/a.bɔʁ.dabl/',
      german: '/ɛɐ̯ˈʃvɪŋlɪç/',
      spanish: '/aseˈkible/'
    }
  },
  {
    english: 'discount',
    arabic: 'خصم',
    french: 'réduction',
    german: 'Rabatt',
    spanish: 'descuento',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɪskaʊnt/',
      french: '/ʁe.dyk.sjɔ̃/',
      german: '/ʁaˈbat/',
      spanish: '/desˈkwento/'
    }
  },
  {
    english: 'sale',
    arabic: 'تخفيضات',
    french: 'soldes',
    german: 'Ausverkauf',
    spanish: 'rebajas',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/seɪl/',
      french: '/sɔld/',
      german: '/ˈaʊs.fɛɐ̯ˌkaʊf/',
      spanish: '/reˈβaxas/'
    }
  },
  {
    english: 'offer / deal',
    arabic: 'عرض',
    french: 'offre',
    german: 'Angebot',
    spanish: 'oferta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɒfər / diːl/',
      french: '/ɔfʁ/',
      german: '/ˈanɡəˌboːt/',
      spanish: '/oˈfeɾta/'
    }
  },
  {
    english: 'bargain',
    arabic: 'صفقة رابحة',
    french: 'bonne affaire',
    german: 'Schnäppchen',
    spanish: 'ganga',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbɑːrɡɪn/',
      french: '/bɔn a.fɛʁ/',
      german: '/ˈʃnɛpçən/',
      spanish: '/ˈɡaŋɡa/'
    }
  },
  {
    english: 'receipt',
    arabic: 'إيصال',
    french: 'reçu/ticket de caisse',
    german: 'Quittung',
    spanish: 'recibo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/rɪˈsiːt/',
      french: '/ʁə.sy/',
      german: '/ˈkvɪtʊŋ/',
      spanish: '/reˈsiβo/'
    }
  },
  {
    english: 'bill',
    arabic: 'الفاتورة',
    french: 'facture/addition',
    german: 'Rechnung',
    spanish: 'factura/cuenta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bɪl/',
      french: '/fak.tyʁ/',
      german: '/ˈʁɛçnʊŋ/',
      spanish: '/fakˈtuɾa/'
    }
  },
  {
    english: 'change',
    arabic: 'الباقي',
    french: 'monnaie (rendue)',
    german: 'Wechselgeld',
    spanish: 'cambio (vuelto)',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/tʃeɪndʒ/',
      french: '/mɔ.nɛ/',
      german: '/ˈvɛksl̩ˌɡɛlt/',
      spanish: '/ˈkambjo/'
    }
  },
  {
    english: 'pay',
    arabic: 'يدفع',
    french: 'payer',
    german: 'bezahlen',
    spanish: 'pagar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/peɪ/',
      french: '/pɛ.je/',
      german: '/bəˈtsaːlən/',
      spanish: '/paˈɣaɾ/'
    }
  },
  {
    english: 'buy',
    arabic: 'يشتري',
    french: 'acheter',
    german: 'kaufen',
    spanish: 'comprar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/baɪ/',
      french: '/aʃ.te/',
      german: '/ˈkaʊfn̩/',
      spanish: '/komˈpɾaɾ/'
    }
  },
  {
    english: 'sell',
    arabic: 'يبيع',
    french: 'vendre',
    german: 'verkaufen',
    spanish: 'vender',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/sɛl/',
      french: '/vɑ̃dʁ/',
      german: '/fɛɐ̯ˈkaʊfn̩/',
      spanish: '/benˈdeɾ/'
    }
  },
  {
    english: 'spend',
    arabic: 'ينفق',
    french: 'dépenser',
    german: 'ausgeben',
    spanish: 'gastar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/spɛnd/',
      french: '/de.pɑ̃.se/',
      german: '/ˈaʊsˌɡeːbn̩/',
      spanish: '/ɡasˈtaɾ/'
    }
  },
  {
    english: 'save (money)',
    arabic: 'يوفر (المال)',
    french: 'économiser',
    german: 'sparen',
    spanish: 'ahorrar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/seɪv/',
      french: '/e.kɔ.nɔ.mi.ze/',
      german: '/ˈʃpaːʁən/',
      spanish: '/aoˈraɾ/'
    }
  },
  {
    english: 'budget',
    arabic: 'الميزانية',
    french: 'budget',
    german: 'Budget',
    spanish: 'presupuesto',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbʌdʒɪt/',
      french: '/byd.ʒɛ/',
      german: '/bʏˈdʒeː/',
      spanish: '/pɾesuˈpwesto/'
    }
  },
  {
    english: 'shop / store',
    arabic: 'متجر',
    french: 'magasin',
    german: 'Geschäft/Laden',
    spanish: 'tienda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ʃɒp / stɔːr/',
      french: '/ma.ɡa.zɛ̃/',
      german: '/ɡəˈʃɛft/',
      spanish: '/ˈtjenda/'
    }
  },
  {
    english: 'supermarket',
    arabic: 'سوبر ماركت',
    french: 'supermarché',
    german: 'Supermarkt',
    spanish: 'supermercado',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsuːpərmɑːrkɪt/',
      french: '/sy.pɛʁ.maʁ.ʃe/',
      german: '/ˈzuːpɐˌmaʁkt/',
      spanish: '/supeɾmeɾˈkaðo/'
    }
  },
  {
    english: 'market',
    arabic: 'سوق',
    french: 'marché',
    german: 'Markt',
    spanish: 'mercado',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmɑːrkɪt/',
      french: '/maʁ.ʃe/',
      german: '/maʁkt/',
      spanish: '/meɾˈkaðo/'
    }
  },
  {
    english: 'mall',
    arabic: 'مول',
    french: 'centre commercial',
    german: 'Einkaufszentrum',
    spanish: 'centro comercial',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/mɔːl/',
      french: '/sɑ̃tʁ kɔ.mɛʁ.sjal/',
      german: '/ˈaɪnkaʊfsˌtsɛntʁʊm/',
      spanish: '/ˈsentɾo komeɾˈsjal/'
    }
  },
  {
    english: 'shopping cart',
    arabic: 'عربة التسوق',
    french: 'chariot',
    german: 'Einkaufswagen',
    spanish: 'carrito de compras',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈʃɒpɪŋ kɑːrt/',
      french: '/ʃa.ʁjo/',
      german: '/ˈaɪnkaʊfsˌvaːɡn̩/',
      spanish: '/kaˈrito ðe ˈkompɾas/'
    }
  },
  {
    english: 'cashier',
    arabic: 'أمين الصندوق',
    french: 'caissier/caissière',
    german: 'Kassierer(in)',
    spanish: 'cajero/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kæˈʃɪər/',
      french: '/kɛ.sje/',
      german: '/kaˈsiːʁɐ/',
      spanish: '/kaˈxeɾo/'
    }
  },
  {
    english: 'customer',
    arabic: 'عميل / زبون',
    french: 'client(e)',
    german: 'Kunde/Kundin',
    spanish: 'cliente',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkʌstəmər/',
      french: '/kli.jɑ̃/',
      german: '/ˈkʊndə/',
      spanish: '/kljenˈte/'
    }
  },
  {
    english: 'size',
    arabic: 'المقاس',
    french: 'taille',
    german: 'Größe',
    spanish: 'talla',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/saɪz/',
      french: '/taj/',
      german: '/ˈɡʁøːsə/',
      spanish: '/ˈtaʎa/'
    }
  },
  {
    english: 'fitting room',
    arabic: 'غرفة القياس',
    french: "cabine d'essayage",
    german: 'Umkleidekabine',
    spanish: 'probador',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɪtɪŋ ruːm/',
      french: '/ka.bin de.se.jaʒ/',
      german: '/ˈʊmˌklaɪdəkaˌbiːnə/',
      spanish: '/pɾoβaˈðoɾ/'
    }
  },
  {
    english: 'try on',
    arabic: 'يجرب (ملابس)',
    french: 'essayer',
    german: 'anprobieren',
    spanish: 'probarse',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/traɪ ɒn/',
      french: '/e.sɛ.je/',
      german: '/ˈanpʁoˌbiːʁən/',
      spanish: '/pɾoˈβaɾse/'
    }
  },
  {
    english: 'refund',
    arabic: 'استرجاع الأموال',
    french: 'remboursement',
    german: 'Rückerstattung',
    spanish: 'reembolso',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈriːfʌnd/',
      french: '/ʁɑ̃.buʁ.səmɑ̃/',
      german: '/ˈʁʏkʔɛɐ̯ˌʃtatʊŋ/',
      spanish: '/reemˈbolso/'
    }
  },
  {
    english: 'exchange',
    arabic: 'استبدال',
    french: 'échange',
    german: 'Umtausch',
    spanish: 'cambio/canje',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ɪksˈtʃeɪndʒ/',
      french: '/e.ʃɑ̃ʒ/',
      german: '/ˈʊmˌtaʊʃ/',
      spanish: '/ˈkambjo/'
    }
  },
  {
    english: 'return',
    arabic: 'يرجع (سلعة)',
    french: 'retour/rendre',
    german: 'zurückgeben',
    spanish: 'devolución/devolver',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/rɪˈtɜːrn/',
      french: '/ʁɑ̃dʁ/',
      german: '/tsuˈʁʏkˌɡeːbn̩/',
      spanish: '/deβolˈβeɾ/'
    }
  },
  {
    english: 'delivery',
    arabic: 'التوصيل',
    french: 'livraison',
    german: 'Lieferung',
    spanish: 'entrega',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈlɪvəri/',
      french: '/li.vʁɛ.zɔ̃/',
      german: '/ˈliːfəʁʊŋ/',
      spanish: '/enˈtɾeɣa/'
    }
  },
  {
    english: 'online shopping',
    arabic: 'التسوق عبر الإنترنت',
    french: 'achats en ligne',
    german: 'Online-Einkauf',
    spanish: 'compras en línea',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɒnlaɪn ˈʃɒpɪŋ/',
      french: '/a.ʃa ɑ̃ liɲ/',
      german: '/ˈɔnlaɪn ˈaɪnkaʊf/',
      spanish: '/ˈkompɾas en ˈlinea/'
    }
  },
  {
    english: 'brand',
    arabic: 'علامة تجارية',
    french: 'marque',
    german: 'Marke',
    spanish: 'marca',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/brænd/',
      french: '/maʁk/',
      german: '/ˈmaʁkə/',
      spanish: '/ˈmaɾka/'
    }
  },
  {
    english: 'quality',
    arabic: 'الجودة',
    french: 'qualité',
    german: 'Qualität',
    spanish: 'calidad',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈkwɒlɪti/',
      french: '/ka.li.te/',
      german: '/kvaliˈtɛːt/',
      spanish: '/kaliˈðað/'
    }
  },
  {
    english: 'currency',
    arabic: 'العملة',
    french: 'monnaie (devise)',
    german: 'Währung',
    spanish: 'moneda (divisa)',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈkʌrənsi/',
      french: '/də.viz/',
      german: '/ˈvɛːʁʊŋ/',
      spanish: '/moˈneða/'
    }
  },
  {
    english: 'bank',
    arabic: 'بنك',
    french: 'banque',
    german: 'Bank',
    spanish: 'banco',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bæŋk/',
      french: '/bɑ̃k/',
      german: '/baŋk/',
      spanish: '/ˈbaŋko/'
    }
  },
  {
    english: 'ATM',
    arabic: 'ماكينة الصراف الآلي',
    french: 'distributeur automatique',
    german: 'Geldautomat',
    spanish: 'cajero automático',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˌeɪ tiː ˈɛm/',
      french: '/dis.tʁi.by.tœʁ/',
      german: '/ˈɡɛltʔaʊtoˌmaːt/',
      spanish: '/kaˈxeɾo awtoˈmatiko/'
    }
  },
  {
    english: 'salary',
    arabic: 'الراتب',
    french: 'salaire',
    german: 'Gehalt',
    spanish: 'salario',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsæləri/',
      french: '/sa.lɛʁ/',
      german: '/ɡəˈhalt/',
      spanish: '/saˈlaɾjo/'
    }
  },
  {
    english: 'savings',
    arabic: 'المدخرات',
    french: 'économies',
    german: 'Ersparnisse',
    spanish: 'ahorros',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈseɪvɪŋz/',
      french: '/e.kɔ.nɔ.mi/',
      german: '/ɛɐ̯ˈʃpaːɐ̯nɪsə/',
      spanish: '/aˈoros/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: "I don't have much money.",
    arabic: 'ليس لدي الكثير من المال.',
    french: "Je n'ai pas beaucoup d'argent.",
    german: 'Ich habe nicht viel Geld.',
    spanish: 'No tengo mucho dinero.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'll pay in cash.",
    arabic: 'سأدفع نقدًا.',
    french: 'Je vais payer en espèces.',
    german: 'Ich zahle bar.',
    spanish: 'Pagaré en efectivo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I found a coin on the street.',
    arabic: 'وجدت عملة معدنية في الشارع.',
    french: 'J’ai trouvé une pièce dans la rue.',
    german: 'Ich habe eine Münze auf der Straße gefunden.',
    spanish: 'Encontré una moneda en la calle.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He gave me a fifty-pound note.',
    arabic: 'أعطاني ورقة نقدية من فئة الخمسين جنيهًا.',
    french: 'Il m’a donné un billet de cinquante livres.',
    german: 'Er hat mir einen Fünfzig-Pfund-Schein gegeben.',
    spanish: 'Me dio un billete de cincuenta libras.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Do you accept credit cards?',
    arabic: 'هل تقبلون بطاقات الائتمان؟',
    french: 'Acceptez-vous les cartes de crédit ?',
    german: 'Akzeptieren Sie Kreditkarten?',
    spanish: '¿Aceptan tarjetas de crédito?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I paid with my debit card.',
    arabic: 'دفعت ببطاقة الخصم المباشر.',
    french: 'J’ai payé avec ma carte de débit.',
    german: 'Ich habe mit meiner Debitkarte bezahlt.',
    spanish: 'Pagué con mi tarjeta de débito.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I lost my wallet yesterday.',
    arabic: 'فقدت محفظتي أمس.',
    french: 'J’ai perdu mon portefeuille hier.',
    german: 'Ich habe gestern mein Portemonnaie verloren.',
    spanish: 'Perdí mi cartera ayer.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "What's the price of this shirt?",
    arabic: 'ما سعر هذا القميص؟',
    french: 'Quel est le prix de cette chemise ?',
    german: 'Was kostet dieses Hemd?',
    spanish: '¿Cuál es el precio de esta camisa?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'How much does it cost?',
    arabic: 'كم يكلف هذا؟',
    french: 'Combien ça coûte ?',
    german: 'Wie viel kostet das?',
    spanish: '¿Cuánto cuesta?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This bag is too expensive.',
    arabic: 'هذه الحقيبة غالية جدًا.',
    french: 'Ce sac est trop cher.',
    german: 'Diese Tasche ist zu teuer.',
    spanish: 'Este bolso es demasiado caro.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'These shoes are cheap.',
    arabic: 'هذا الحذاء رخيص.',
    french: 'Ces chaussures sont bon marché.',
    german: 'Diese Schuhe sind billig.',
    spanish: 'Estos zapatos son baratos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The prices here are affordable.',
    arabic: 'الأسعار هنا معقولة.',
    french: 'Les prix ici sont abordables.',
    german: 'Die Preise hier sind erschwinglich.',
    spanish: 'Los precios aquí son asequibles.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "There's a discount on jackets.",
    arabic: 'هناك خصم على الجاكيتات.',
    french: 'Il y a une réduction sur les vestes.',
    german: 'Es gibt einen Rabatt auf Jacken.',
    spanish: 'Hay un descuento en las chaquetas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The store is having a sale.',
    arabic: 'المتجر يقيم تخفيضات.',
    french: 'Le magasin fait des soldes.',
    german: 'Der Laden hat Ausverkauf.',
    spanish: 'La tienda tiene rebajas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This is a great offer.',
    arabic: 'هذا عرض رائع.',
    french: 'C’est une excellente offre.',
    german: 'Das ist ein tolles Angebot.',
    spanish: 'Esta es una excelente oferta.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I got a real bargain today.',
    arabic: 'حصلت على صفقة رابحة حقيقية اليوم.',
    french: 'J’ai fait une vraie bonne affaire aujourd’hui.',
    german: 'Ich habe heute ein echtes Schnäppchen gemacht.',
    spanish: 'Hoy conseguí una verdadera ganga.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Can I have a receipt, please?',
    arabic: 'هل يمكنني الحصول على إيصال من فضلك؟',
    french: 'Puis-je avoir un reçu, s’il vous plaît ?',
    german: 'Kann ich bitte eine Quittung haben?',
    spanish: '¿Me puede dar un recibo, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I see the bill?',
    arabic: 'هل يمكنني رؤية الفاتورة؟',
    french: 'Puis-je voir la facture ?',
    german: 'Kann ich die Rechnung sehen?',
    spanish: '¿Puedo ver la factura?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "Here's your change.",
    arabic: 'هذا هو الباقي.',
    french: 'Voici votre monnaie.',
    german: 'Hier ist Ihr Wechselgeld.',
    spanish: 'Aquí tiene su cambio.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'll pay for lunch today.",
    arabic: 'سأدفع ثمن الغداء اليوم.',
    french: 'Je paierai le déjeuner aujourd’hui.',
    german: 'Ich bezahle heute das Mittagessen.',
    spanish: 'Yo pago el almuerzo hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I want to buy new shoes.',
    arabic: 'أريد شراء حذاء جديد.',
    french: 'Je veux acheter de nouvelles chaussures.',
    german: 'Ich möchte neue Schuhe kaufen.',
    spanish: 'Quiero comprar zapatos nuevos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'They sell fresh vegetables.',
    arabic: 'يبيعون خضروات طازجة.',
    french: 'Ils vendent des légumes frais.',
    german: 'Sie verkaufen frisches Gemüse.',
    spanish: 'Venden verduras frescas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I spend a lot on books.',
    arabic: 'أنفق الكثير على الكتب.',
    french: 'Je dépense beaucoup en livres.',
    german: 'Ich gebe viel für Bücher aus.',
    spanish: 'Gasto mucho en libros.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I try to save money every month.',
    arabic: 'أحاول توفير المال كل شهر.',
    french: 'J’essaie d’économiser de l’argent chaque mois.',
    german: 'Ich versuche, jeden Monat Geld zu sparen.',
    spanish: 'Trato de ahorrar dinero cada mes.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We have a small budget.',
    arabic: 'لدينا ميزانية صغيرة.',
    french: 'Nous avons un petit budget.',
    german: 'Wir haben ein kleines Budget.',
    spanish: 'Tenemos un presupuesto pequeño.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I bought it at that store.',
    arabic: 'اشتريته من ذلك المتجر.',
    french: 'Je l’ai acheté dans ce magasin.',
    german: 'Ich habe es in diesem Geschäft gekauft.',
    spanish: 'Lo compré en esa tienda.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I do my shopping at the supermarket.',
    arabic: 'أقوم بتسوقي في السوبر ماركت.',
    french: 'Je fais mes courses au supermarché.',
    german: 'Ich kaufe im Supermarkt ein.',
    spanish: 'Hago mis compras en el supermercado.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I buy vegetables at the market.',
    arabic: 'أشتري الخضروات من السوق.',
    french: 'J’achète des légumes au marché.',
    german: 'Ich kaufe Gemüse auf dem Markt.',
    spanish: 'Compro verduras en el mercado.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We spent the day at the mall.',
    arabic: 'قضينا اليوم في المول.',
    french: 'Nous avons passé la journée au centre commercial.',
    german: 'Wir haben den Tag im Einkaufszentrum verbracht.',
    spanish: 'Pasamos el día en el centro comercial.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Put the items in the shopping cart.',
    arabic: 'ضع الأغراض في عربة التسوق.',
    french: 'Mets les articles dans le chariot.',
    german: 'Leg die Artikel in den Einkaufswagen.',
    spanish: 'Pon los artículos en el carrito de compras.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The cashier was very polite.',
    arabic: 'كان أمين الصندوق مهذبًا جدًا.',
    french: 'Le caissier était très poli.',
    german: 'Der Kassierer war sehr höflich.',
    spanish: 'El cajero fue muy amable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The customer asked for a refund.',
    arabic: 'طلب العميل استرجاع الأموال.',
    french: 'Le client a demandé un remboursement.',
    german: 'Der Kunde hat eine Rückerstattung verlangt.',
    spanish: 'El cliente pidió un reembolso.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Do you have a bigger size?',
    arabic: 'هل لديك مقاس أكبر؟',
    french: 'Avez-vous une taille plus grande ?',
    german: 'Haben Sie eine größere Größe?',
    spanish: '¿Tiene una talla más grande?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Where is the fitting room?',
    arabic: 'أين غرفة القياس؟',
    french: 'Où est la cabine d’essayage ?',
    german: 'Wo ist die Umkleidekabine?',
    spanish: '¿Dónde está el probador?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I try this on?',
    arabic: 'هل يمكنني تجربة هذا؟',
    french: 'Puis-je l’essayer ?',
    german: 'Kann ich das anprobieren?',
    spanish: '¿Puedo probármelo?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I asked for a refund.',
    arabic: 'طلبت استرجاع الأموال.',
    french: 'J’ai demandé un remboursement.',
    german: 'Ich habe eine Rückerstattung verlangt.',
    spanish: 'Pedí un reembolso.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "I'd like to exchange this item.",
    arabic: 'أرغب في استبدال هذا الغرض.',
    french: 'Je voudrais échanger cet article.',
    german: 'Ich möchte diesen Artikel umtauschen.',
    spanish: 'Quisiera cambiar este artículo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Can I return this?',
    arabic: 'هل يمكنني إرجاع هذا؟',
    french: 'Puis-je rendre ceci ?',
    german: 'Kann ich das zurückgeben?',
    spanish: '¿Puedo devolver esto?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Delivery takes three days.',
    arabic: 'يستغرق التوصيل ثلاثة أيام.',
    french: 'La livraison prend trois jours.',
    german: 'Die Lieferung dauert drei Tage.',
    spanish: 'La entrega tarda tres días.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I do a lot of online shopping.',
    arabic: 'أقوم بالكثير من التسوق عبر الإنترنت.',
    french: 'Je fais beaucoup d’achats en ligne.',
    german: 'Ich kaufe viel online ein.',
    spanish: 'Hago muchas compras en línea.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This is a famous brand.',
    arabic: 'هذه علامة تجارية مشهورة.',
    french: 'C’est une marque célèbre.',
    german: 'Das ist eine bekannte Marke.',
    spanish: 'Esta es una marca famosa.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The quality of this product is great.',
    arabic: 'جودة هذا المنتج ممتازة.',
    french: 'La qualité de ce produit est excellente.',
    german: 'Die Qualität dieses Produkts ist ausgezeichnet.',
    spanish: 'La calidad de este producto es excelente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The local currency is the pound.',
    arabic: 'العملة المحلية هي الجنيه.',
    french: 'La monnaie locale est la livre.',
    german: 'Die Landeswährung ist das Pfund.',
    spanish: 'La moneda local es la libra.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I need to go to the bank.',
    arabic: 'أحتاج للذهاب إلى البنك.',
    french: 'Je dois aller à la banque.',
    german: 'Ich muss zur Bank gehen.',
    spanish: 'Necesito ir al banco.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "There's an ATM near here.",
    arabic: 'يوجد ماكينة صراف آلي بالقرب من هنا.',
    french: 'Il y a un distributeur automatique près d’ici.',
    german: 'Es gibt einen Geldautomaten in der Nähe.',
    spanish: 'Hay un cajero automático cerca de aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My salary is paid monthly.',
    arabic: 'يُدفع راتبي شهريًا.',
    french: 'Mon salaire est versé mensuellement.',
    german: 'Mein Gehalt wird monatlich gezahlt.',
    spanish: 'Mi salario se paga mensualmente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I keep my savings in the bank.',
    arabic: 'أحتفظ بمدخراتي في البنك.',
    french: 'Je garde mes économies à la banque.',
    german: 'Ich bewahre meine Ersparnisse bei der Bank auf.',
    spanish: 'Guardo mis ahorros en el banco.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS =====================
  {
    english: 'How much does this cost?',
    arabic: 'كم يكلف هذا؟',
    french: 'Combien ça coûte ?',
    german: 'Wie viel kostet das?',
    spanish: '¿Cuánto cuesta esto?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's too expensive",
    arabic: 'إنه غالي جدًا',
    french: "C'est trop cher",
    german: 'Das ist zu teuer',
    spanish: 'Es demasiado caro',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I get a discount?',
    arabic: 'هل يمكنني الحصول على خصم؟',
    french: 'Puis-je avoir une réduction ?',
    german: 'Kann ich einen Rabatt bekommen?',
    spanish: '¿Me puede hacer un descuento?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Keep the change',
    arabic: 'احتفظ بالباقي',
    french: 'Gardez la monnaie',
    german: 'Behalten Sie das Wechselgeld',
    spanish: 'Quédese con el cambio',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'm just looking, thanks",
    arabic: 'أنا فقط أتفرج، شكرًا',
    french: 'Je regarde seulement, merci',
    german: 'Ich schaue mich nur um, danke',
    spanish: 'Solo estoy mirando, gracias',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Do you have this in a different size?',
    arabic: 'هل يتوفر هذا بمقاس آخر؟',
    french: "L'avez-vous dans une autre taille ?",
    german: 'Haben Sie das in einer anderen Größe?',
    spanish: '¿Lo tiene en otra talla?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'd like to return this, please",
    arabic: 'أريد إرجاع هذا، من فضلك',
    french: "Je voudrais rendre ceci, s'il vous plaît",
    german: 'Ich möchte das bitte zurückgeben',
    spanish: 'Quisiera devolver esto, por favor',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL RETAIL & COMMERCE UNITS =====================
  {
    english: 'price tag',
    arabic: 'بطاقة السعر',
    french: 'étiquette de prix',
    german: 'Preisschild',
    spanish: 'etiqueta de precio',
    type: 'chunk',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/praɪs tæɡ/',
      french: '/e.ti.kɛt də pʁi/',
      german: '/ˈpʁaɪsˌʃɪlt/',
      spanish: '/etiˈketa ðe ˈpɾesjo/'
    }
  },
  {
    english: 'special offer',
    arabic: 'عرض خاص',
    french: 'offre spéciale',
    german: 'Sonderangebot',
    spanish: 'oferta especial',
    type: 'chunk',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈspɛʃəl ˈɒfər/',
      french: '/ɔfʁ spe.sjal/',
      german: '/ˈzɔndɐʔanɡəˌboːt/',
      spanish: '/oˈfeɾta espeˈsjal/'
    }
  },
  {
    english: 'in stock',
    arabic: 'متوفر في المخزن',
    french: 'en stock',
    german: 'auf Lager',
    spanish: 'en stock / disponible',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/ɪn stɒk/',
      french: '/ɑ̃ stɔk/',
      german: '/aʊf ˈlaːɡɐ/',
      spanish: '/en stok/'
    }
  },
  {
    english: 'out of stock',
    arabic: 'غير متوفر / نفد المخزون',
    french: 'en rupture de stock',
    german: 'ausverkauft / nicht vorrätig',
    spanish: 'agotado / fuera de stock',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/aʊt əv stɒk/',
      french: '/ɑ̃ ʁyp.tyʁ də stɔk/',
      german: '/ˈaʊsfɛɐ̯ˌkaʊft/',
      spanish: '/aɣoˈtaðo/'
    }
  },
  {
    english: 'window shopping',
    arabic: 'التفرج على الواجهات',
    french: 'lèche-vitrines',
    german: 'Schaufensterbummel',
    spanish: 'mirar escaparates',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɪndoʊ ˈʃɒpɪŋ/',
      french: '/lɛʃ vi.tʁin/',
      german: '/ˈʃaʊ̯ˌfɛnstɐˌbʊml̩/',
      spanish: '/miˈɾaɾ eskapaˈɾates/'
    }
  },
  {
    english: 'checkout / cash desk',
    arabic: 'صندوق الدفع / الكاشير',
    french: 'caisse',
    german: 'Kasse',
    spanish: 'caja',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtʃɛkaʊt/',
      french: '/kɛs/',
      german: '/ˈkasə/',
      spanish: '/ˈkaxa/'
    }
  },
  {
    english: 'shopping list',
    arabic: 'قائمة التسوق',
    french: 'liste de courses',
    german: 'Einkaufsliste',
    spanish: 'lista de compras',
    type: 'chunk',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈʃɒpɪŋ lɪst/',
      french: '/list də kuʁs/',
      german: '/ˈaɪnkaʊfsˌlɪstə/',
      spanish: '/ˈlista ðe ˈkompɾas/'
    }
  },
  {
    english: 'plastic bag / bag',
    arabic: 'كيس تسوق',
    french: 'sac en plastique / sac',
    german: 'Tüte / Plastiktüte',
    spanish: 'bolsa de plástico',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈplæstɪk bæɡ/',
      french: '/sak/',
      german: '/ˈtyːtə/',
      spanish: '/ˈbolsa/'
    }
  },
  {
    english: 'department store',
    arabic: 'متجر متعدد الأقسام',
    french: 'grand magasin',
    german: 'Kaufhaus / Warenhaus',
    spanish: 'grandes almacenes',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈpɑːrtmənt stɔːr/',
      french: '/ɡʁɑ̃ ma.ɡa.zɛ̃/',
      german: '/ˈkaʊfˌhaʊs/',
      spanish: '/ˈɡɾandes almaˈsenes/'
    }
  },
  {
    english: 'bakery',
    arabic: 'مخبز',
    french: 'boulangerie',
    german: 'Bäckerei',
    spanish: 'panadería',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbeɪkəri/',
      french: '/bu.lɑ̃.ʒʁi/',
      german: '/bɛkəˈʁaɪ/',
      spanish: '/panaðeˈɾi.a/'
    }
  },
  {
    english: 'pharmacy / drugstore',
    arabic: 'صيدلية',
    french: 'pharmacie',
    german: 'Apotheke',
    spanish: 'farmacia',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɑːrməsi/',
      french: '/faʁ.ma.si/',
      german: '/apoˈteːkə/',
      spanish: '/faɾˈmasja/'
    }
  },
  {
    english: 'bookstore',
    arabic: 'مكتبة (لبيع الكتب)',
    french: 'librairie',
    german: 'Buchhandlung',
    spanish: 'librería',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbʊkstɔːr/',
      french: '/li.bʁɛ.ʁi/',
      german: '/ˈbuːxˌhandlʊŋ/',
      spanish: '/liβɾeˈɾi.a/'
    }
  },
  {
    english: 'clothing store',
    arabic: 'متجر ملابس',
    french: 'magasin de vêtements',
    german: 'Bekleidungsgeschäft',
    spanish: 'tienda de ropa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkloʊðɪŋ stɔːr/',
      french: '/ma.ɡa.zɛ̃ də vɛt.mɑ̃/',
      german: '/bəˈklaɪdʊŋs.ɡəˌʃɛft/',
      spanish: '/ˈtjenda ðe ˈropa/'
    }
  },
  {
    english: 'pay by card',
    arabic: 'الدفع بالبطاقة',
    french: 'payer par carte',
    german: 'mit Karte zahlen',
    spanish: 'pagar con tarjeta',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/peɪ baɪ kɑːrd/',
      french: '/pɛ.je paʁ kaʁt/',
      german: '/mɪt ˈkaʁtə ˈtsaːlən/',
      spanish: '/paˈɣaɾ kon taɾˈxeta/'
    }
  },
  {
    english: 'pay in cash',
    arabic: 'الدفع نقدًا',
    french: 'payer en espèces',
    german: 'bar bezahlen',
    spanish: 'pagar en efectivo',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/peɪ ɪn kæʃ/',
      french: '/pɛ.je ɑ̃n‿ɛs.pɛs/',
      german: '/baːɐ̯ bəˈtsaːlən/',
      spanish: '/paˈɣaɾ en efekˈtiβo/'
    }
  }
];
