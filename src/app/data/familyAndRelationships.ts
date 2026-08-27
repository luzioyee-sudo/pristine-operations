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

export const FAMILY_RELATIONSHIPS_DATA: TopicItemRow[] = [
  // ===================== IMAGE 3: WORDS & TERMS =====================
  {
    english: 'mother',
    arabic: 'أم',
    french: 'mère',
    german: 'Mutter',
    spanish: 'madre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmʌðər/',
      french: '/mɛʁ/',
      german: '/ˈmʊtɐ/',
      spanish: '/ˈmaðɾe/'
    }
  },
  {
    english: 'father',
    arabic: 'أب',
    french: 'père',
    german: 'Vater',
    spanish: 'padre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɑːðər/',
      french: '/pɛʁ/',
      german: '/ˈfaːtɐ/',
      spanish: '/ˈpaðɾe/'
    }
  },
  {
    english: 'parents',
    arabic: 'الوالدان',
    french: 'parents',
    german: 'Eltern',
    spanish: 'padres',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈpeərənts/',
      french: '/pa.ʁɑ̃/',
      german: '/ˈɛltɐn/',
      spanish: '/ˈpaðɾes/'
    }
  },
  {
    english: 'brother',
    arabic: 'أخ',
    french: 'frère',
    german: 'Bruder',
    spanish: 'hermano',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbrʌðər/',
      french: '/fʁɛʁ/',
      german: '/ˈbʁuːdɐ/',
      spanish: '/eɾˈmano/'
    }
  },
  {
    english: 'sister',
    arabic: 'أخت',
    french: 'sœur',
    german: 'Schwester',
    spanish: 'hermana',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɪstər/',
      french: '/sœʁ/',
      german: '/ˈʃvɛstɐ/',
      spanish: '/eɾˈmana/'
    }
  },
  {
    english: 'siblings',
    arabic: 'الإخوة والأخوات',
    french: 'frères et sœurs',
    german: 'Geschwister',
    spanish: 'hermanos',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɪblɪŋz/',
      french: '/fʁɛʁ e sœʁ/',
      german: '/ɡəˈʃvɪstɐ/',
      spanish: '/eɾˈmanos/'
    }
  },
  {
    english: 'husband',
    arabic: 'زوج',
    french: 'mari',
    german: 'Ehemann',
    spanish: 'esposo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈhʌzbənd/',
      french: '/ma.ʁi/',
      german: '/ˈeːəˌman/',
      spanish: '/esˈposo/'
    }
  },
  {
    english: 'wife',
    arabic: 'زوجة',
    french: 'femme (épouse)',
    german: 'Ehefrau',
    spanish: 'esposa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/waɪf/',
      french: '/fam/',
      german: '/ˈeːəˌfʁaʊ/',
      spanish: '/esˈposa/'
    }
  },
  {
    english: 'spouse',
    arabic: 'الزوج/الزوجة',
    french: 'conjoint(e)',
    german: 'Ehepartner(in)',
    spanish: 'cónyuge',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/spaʊs/',
      french: '/kɔ̃.ʒwɛ̃/',
      german: '/ˈeːəˌpaʁtnɐ/',
      spanish: '/ˈkoɲuʝe/'
    }
  },
  {
    english: 'son',
    arabic: 'ابن',
    french: 'fils',
    german: 'Sohn',
    spanish: 'hijo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/sʌn/',
      french: '/fis/',
      german: '/zoːn/',
      spanish: '/ˈixo/'
    }
  },
  {
    english: 'daughter',
    arabic: 'ابنة',
    french: 'fille',
    german: 'Tochter',
    spanish: 'hija',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɔːtər/',
      french: '/fij/',
      german: '/ˈtɔxtɐ/',
      spanish: '/ˈixa/'
    }
  },
  {
    english: 'children / kids',
    arabic: 'أطفال',
    french: 'enfants',
    german: 'Kinder',
    spanish: 'hijos/niños',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtʃɪldrən / kɪdz/',
      french: '/ɑ̃.fɑ̃/',
      german: '/ˈkɪndɐ/',
      spanish: '/ˈixos/ /ˈniɲos/'
    }
  },
  {
    english: 'grandmother',
    arabic: 'جدة',
    french: 'grand-mère',
    german: 'Großmutter',
    spanish: 'abuela',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡrænˌmʌðər/',
      french: '/ɡʁɑ̃.mɛʁ/',
      german: '/ˈɡʁoːsˌmʊtɐ/',
      spanish: '/aˈβwela/'
    }
  },
  {
    english: 'grandfather',
    arabic: 'جد',
    french: 'grand-père',
    german: 'Großvater',
    spanish: 'abuelo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡrænˌfɑːðər/',
      french: '/ɡʁɑ̃.pɛʁ/',
      german: '/ˈɡʁoːsˌfaːtɐ/',
      spanish: '/aˈβwelo/'
    }
  },
  {
    english: 'grandparents',
    arabic: 'الأجداد',
    french: 'grands-parents',
    german: 'Großeltern',
    spanish: 'abuelos',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡrænˌpeərənts/',
      french: '/ɡʁɑ̃.pa.ʁɑ̃/',
      german: '/ˈɡʁoːsˌʔɛltɐn/',
      spanish: '/aˈβwelos/'
    }
  },
  {
    english: 'grandson',
    arabic: 'حفيد',
    french: 'petit-fils',
    german: 'Enkel',
    spanish: 'nieto',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡrænsʌn/',
      french: '/pə.ti.fis/',
      german: '/ˈɛŋkl̩/',
      spanish: '/ˈnjeto/'
    }
  },
  {
    english: 'granddaughter',
    arabic: 'حفيدة',
    french: 'petite-fille',
    german: 'Enkelin',
    spanish: 'nieta',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡrænˌdɔːtər/',
      french: '/pə.tit.fij/',
      german: '/ˈɛŋkəlɪn/',
      spanish: '/ˈnjeta/'
    }
  },
  {
    english: 'uncle',
    arabic: 'عم / خال',
    french: 'oncle',
    german: 'Onkel',
    spanish: 'tío',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈʌŋkl/',
      french: '/ɔ̃kl/',
      german: '/ˈɔŋkl̩/',
      spanish: '/ˈti.o/'
    }
  },
  {
    english: 'aunt',
    arabic: 'عمة / خالة',
    french: 'tante',
    german: 'Tante',
    spanish: 'tía',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ænt / ɑːnt/',
      french: '/tɑ̃t/',
      german: '/ˈtantə/',
      spanish: '/ˈti.a/'
    }
  },
  {
    english: 'cousin',
    arabic: 'ابن/بنت العم أو الخال',
    french: 'cousin(e)',
    german: 'Cousin/Cousine',
    spanish: 'primo/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkʌzn/',
      french: '/ku.zɛ̃/',
      german: '/kuˈzɛ̃ː/',
      spanish: '/ˈpɾimo/'
    }
  },
  {
    english: 'nephew',
    arabic: 'ابن الأخ/الأخت',
    french: 'neveu',
    german: 'Neffe',
    spanish: 'sobrino',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈnɛfjuː/',
      french: '/nə.vø/',
      german: '/ˈnɛfə/',
      spanish: '/soˈβɾino/'
    }
  },
  {
    english: 'niece',
    arabic: 'بنت الأخ/الأخت',
    french: 'nièce',
    german: 'Nichte',
    spanish: 'sobrina',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/niːs/',
      french: '/njɛs/',
      german: '/ˈnɪçtə/',
      spanish: '/soˈβɾina/'
    }
  },
  {
    english: 'in-laws',
    arabic: 'أهل الزوج/الزوجة',
    french: 'beaux-parents',
    german: 'Schwiegereltern',
    spanish: 'suegros',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɪn lɔːz/',
      french: '/bo.pa.ʁɑ̃/',
      german: '/ˈʃviːɡɐˌʔɛltɐn/',
      spanish: '/ˈsweɣɾos/'
    }
  },
  {
    english: 'stepmother',
    arabic: 'زوجة الأب',
    french: 'belle-mère',
    german: 'Stiefmutter',
    spanish: 'madrastra',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈstɛpˌmʌðər/',
      french: '/bɛl.mɛʁ/',
      german: '/ˈʃtiːfˌmʊtɐ/',
      spanish: '/maˈðɾastɾa/'
    }
  },
  {
    english: 'stepfather',
    arabic: 'زوج الأم',
    french: 'beau-père',
    german: 'Stiefvater',
    spanish: 'padrastro',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈstɛpˌfɑːðər/',
      french: '/bo.pɛʁ/',
      german: '/ˈʃtiːfˌfaːtɐ/',
      spanish: '/paˈðɾastɾo/'
    }
  },
  {
    english: 'twins',
    arabic: 'توأم',
    french: 'jumeaux/jumelles',
    german: 'Zwillinge',
    spanish: 'gemelos/as',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/twɪnz/',
      french: '/ʒy.mo/',
      german: '/ˈtsvɪlɪŋə/',
      spanish: '/xeˈmelos/'
    }
  },
  {
    english: 'only child',
    arabic: 'الابن الوحيد',
    french: 'enfant unique',
    german: 'Einzelkind',
    spanish: 'hijo/a único/a',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈoʊnli tʃaɪld/',
      french: '/ɑ̃.fɑ̃ y.nik/',
      german: '/ˈaɪntsəlˌkɪnt/',
      spanish: '/ˈixo ˈuniko/'
    }
  },
  {
    english: 'relatives',
    arabic: 'أقارب',
    french: 'proches / parents',
    german: 'Verwandte',
    spanish: 'parientes',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈrɛlətɪvz/',
      french: '/pʁɔʃ/',
      german: '/fɛɐ̯ˈvantə/',
      spanish: '/paˈɾjentes/'
    }
  },
  {
    english: 'family tree',
    arabic: 'شجرة العائلة',
    french: 'arbre généalogique',
    german: 'Stammbaum',
    spanish: 'árbol genealógico',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈfæməli triː/',
      french: '/aʁbʁ ʒe.ne.a.lɔ.ʒik/',
      german: '/ˈʃtamˌbaʊm/',
      spanish: '/ˈaɾβol xene.aˈloxiko/'
    }
  },
  {
    english: 'wedding',
    arabic: 'حفل زفاف',
    french: 'mariage (cérémonie)',
    german: 'Hochzeit',
    spanish: 'boda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɛdɪŋ/',
      french: '/ma.ʁjaʒ/',
      german: '/ˈhɔxˌtsaɪt/',
      spanish: '/ˈboða/'
    }
  },
  {
    english: 'marriage',
    arabic: 'الزواج',
    french: 'mariage',
    german: 'Ehe',
    spanish: 'matrimonio',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈmærɪdʒ/',
      french: '/ma.ʁjaʒ/',
      german: '/ˈeːə/',
      spanish: '/matɾiˈmonjo/'
    }
  },
  {
    english: 'engaged',
    arabic: 'مخطوب',
    french: 'fiancé(e)',
    german: 'verlobt',
    spanish: 'comprometido/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ɪnˈɡeɪdʒd/',
      french: '/fjɑ̃.se/',
      german: '/fɛɐ̯ˈloːpt/',
      spanish: '/kompɾomeˈtiðo/'
    }
  },
  {
    english: 'fiancé / fiancée',
    arabic: 'خطيب / خطيبة',
    french: 'fiancé(e)',
    german: 'Verlobte(r)',
    spanish: 'prometido/a',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/fiːˈɒnseɪ/',
      french: '/fjɑ̃.se/',
      german: '/fɛɐ̯ˈloːptə/',
      spanish: '/pɾomeˈtiðo/'
    }
  },
  {
    english: 'boyfriend / girlfriend',
    arabic: 'صديق / صديقة (علاقة)',
    french: 'petit ami / petite amie',
    german: 'Freund/Freundin',
    spanish: 'novio/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbɔɪfrɛnd / ˈɡɜːrlfrɛnd/',
      french: '/pə.ti.t‿a.mi/',
      german: '/fʁɔɪnt/ /ˈfʁɔɪndɪn/',
      spanish: '/ˈnoβjo/'
    }
  },
  {
    english: 'close family',
    arabic: 'عائلة مقربة',
    french: 'famille proche',
    german: 'enge Familie',
    spanish: 'familia cercana',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/kloʊs ˈfæməli/',
      french: '/fa.mij pʁɔʃ/',
      german: '/ˈɛŋə faˈmiːli̯ə/',
      spanish: '/faˈmilja seɾˈkana/'
    }
  },
  {
    english: 'get along',
    arabic: 'ينسجم / يتفاهم مع',
    french: "bien s'entendre",
    german: 'gut auskommen',
    spanish: 'llevarse bien',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ɡɛt əˈlɔːŋ/',
      french: '/bjɛ̃ sɑ̃.tɑ̃dʁ/',
      german: '/ɡuːt ˈaʊsˌkɔmən/',
      spanish: '/ʝeˈβaɾse βjen/'
    }
  },
  {
    english: 'argue',
    arabic: 'يتجادل',
    french: 'se disputer',
    german: 'streiten',
    spanish: 'discutir',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ˈɑːrɡjuː/',
      french: '/sə dis.py.te/',
      german: '/ˈʃtʁaɪtn̩/',
      spanish: '/diskuˈtiɾ/'
    }
  },
  {
    english: 'support',
    arabic: 'يدعم',
    french: 'soutenir',
    german: 'unterstützen',
    spanish: 'apoyar',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/səˈpɔːrt/',
      french: '/su.tə.niʁ/',
      german: '/ˌʊntɐˈʃtʏtsn̩/',
      spanish: '/apoˈʝaɾ/'
    }
  },
  {
    english: 'raise (children)',
    arabic: 'يربّي (الأطفال)',
    french: 'élever (des enfants)',
    german: 'großziehen',
    spanish: 'criar',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/reɪz ˈtʃɪldrən/',
      french: '/el.ve/',
      german: '/ˈɡʁoːsˌtsiːən/',
      spanish: '/kɾjaɾ/'
    }
  },
  {
    english: 'baby',
    arabic: 'رضيع',
    french: 'bébé',
    german: 'Baby',
    spanish: 'bebé',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbeɪbi/',
      french: '/be.be/',
      german: '/ˈbeːbi/',
      spanish: '/beˈβe/'
    }
  },
  {
    english: 'elderly',
    arabic: 'كبار السن',
    french: 'personnes âgées',
    german: 'ältere Menschen',
    spanish: 'ancianos',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈɛldərli/',
      french: '/pɛʁ.sɔn ɑ.ʒe/',
      german: '/ˈɛltəʁə ˈmɛnʃn̩/',
      spanish: '/anˈsjanos/'
    }
  },

  // ===================== IMAGE 1: SENTENCES & COMMON EXPRESSIONS =====================
  {
    english: 'This is my family',
    arabic: 'هذه عائلتي',
    french: 'Voici ma famille',
    german: 'Das ist meine Familie',
    spanish: 'Esta es mi familia',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have two brothers',
    arabic: 'لدي أخوان',
    french: "J'ai deux frères",
    german: 'Ich habe zwei Brüder',
    spanish: 'Tengo dos hermanos',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She is my sister',
    arabic: 'هي أختي',
    french: "C'est ma sœur",
    german: 'Sie ist meine Schwester',
    spanish: 'Ella es mi hermana',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We get along well',
    arabic: 'نتفاهم جيدًا',
    french: "On s'entend bien",
    german: 'Wir kommen gut miteinander aus',
    spanish: 'Nos llevamos bien',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "I'm close to my family",
    arabic: 'أنا مقرب من عائلتي',
    french: 'Je suis proche de ma famille',
    german: 'Ich stehe meiner Familie nahe',
    spanish: 'Estoy muy unido/a a mi familia',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Do you have any siblings?',
    arabic: 'هل لديك إخوة؟',
    french: 'As-tu des frères et sœurs ?',
    german: 'Hast du Geschwister?',
    spanish: '¿Tienes hermanos?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'How many people are in your family?',
    arabic: 'كم عدد أفراد عائلتك؟',
    french: 'Combien de personnes y a-t-il dans ta famille ?',
    german: 'Wie viele Personen sind in deiner Familie?',
    spanish: '¿Cuántas personas hay en tu familia?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I take after my mother',
    arabic: 'أشبه أمي',
    french: 'Je tiens de ma mère',
    german: 'Ich komme nach meiner Mutter',
    spanish: 'Me parezco a mi madre',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We are a big/small family',
    arabic: 'نحن عائلة كبيرة/صغيرة',
    french: 'Nous sommes une grande/petite famille',
    german: 'Wir sind eine große/kleine Familie',
    spanish: 'Somos una familia grande/pequeña',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He looks just like his father',
    arabic: 'يشبه والده تمامًا',
    french: 'Il ressemble beaucoup à son père',
    german: 'Er sieht genauso aus wie sein Vater',
    spanish: 'Se parece mucho a su padre',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== IMAGE 2: SENTENCES CONTINUED =====================
  {
    english: 'We have many relatives in Alexandria.',
    arabic: 'لدينا أقارب كثيرون في الإسكندرية.',
    french: 'Nous avons beaucoup de proches à Alexandrie.',
    german: 'Wir haben viele Verwandte in Alexandria.',
    spanish: 'Tenemos muchos parientes en Alejandría.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We made a family tree at school.',
    arabic: 'صنعنا شجرة عائلة في المدرسة.',
    french: 'Nous avons fait un arbre généalogique à l’école.',
    german: 'Wir haben in der Schule einen Stammbaum gemacht.',
    spanish: 'Hicimos un árbol genealógico en la escuela.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The wedding was beautiful.',
    arabic: 'كان حفل الزفاف جميلاً.',
    french: 'Le mariage était magnifique.',
    german: 'Die Hochzeit war wunderschön.',
    spanish: 'La boda fue hermosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Their marriage was ten years ago.',
    arabic: 'كان زواجهما منذ عشر سنوات.',
    french: 'Leur mariage remonte à dix ans.',
    german: 'Ihre Ehe war vor zehn Jahren.',
    spanish: 'Su matrimonio fue hace diez años.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My cousin just got engaged.',
    arabic: 'ابن عمي خطب للتو.',
    french: 'Mon cousin vient de se fiancer.',
    german: 'Mein Cousin hat sich gerade verlobt.',
    spanish: 'Mi primo acaba de comprometerse.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'This is my fiancée.',
    arabic: 'هذه خطيبتي.',
    french: 'Voici ma fiancée.',
    german: 'Das ist meine Verlobte.',
    spanish: 'Esta es mi prometida.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'He introduced me to his girlfriend.',
    arabic: 'عرّفني على صديقته.',
    french: "Il m'a présenté sa petite amie.",
    german: 'Er hat mir seine Freundin vorgestellt.',
    spanish: 'Me presentó a su novia.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We are a close family.',
    arabic: 'نحن عائلة مقربة.',
    french: 'Nous sommes une famille unie.',
    german: 'Wir sind eine enge Familie.',
    spanish: 'Somos una familia unida.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I get along well with my brother.',
    arabic: 'أتفاهم جيدًا مع أخي.',
    french: "Je m'entends bien avec mon frère.",
    german: 'Ich komme gut mit meinem Bruder aus.',
    spanish: 'Me llevo bien con mi hermano.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We sometimes argue about small things.',
    arabic: 'نتجادل أحيانًا حول أمور صغيرة.',
    french: 'Nous nous disputons parfois pour des petites choses.',
    german: 'Wir streiten manchmal über Kleinigkeiten.',
    spanish: 'A veces discutimos por cosas pequeñas.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My family always supports me.',
    arabic: 'عائلتي تدعمني دائمًا.',
    french: 'Ma famille me soutient toujours.',
    german: 'Meine Familie unterstützt mich immer.',
    spanish: 'Mi familia siempre me apoya.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'They raised three children.',
    arabic: 'ربّيا ثلاثة أطفال.',
    french: 'Ils ont élevé trois enfants.',
    german: 'Sie haben drei Kinder großgezogen.',
    spanish: 'Criaron a tres hijos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The baby is sleeping.',
    arabic: 'الرضيع نائم.',
    french: 'Le bébé dort.',
    german: 'Das Baby schläft.',
    spanish: 'El bebé está durmiendo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We should respect the elderly.',
    arabic: 'يجب أن نحترم كبار السن.',
    french: 'Nous devrions respecter les personnes âgées.',
    german: 'Wir sollten die älteren Menschen respektieren.',
    spanish: 'Deberíamos respetar a los ancianos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== DEDICATED EXAMPLE SENTENCES FOR ALL VOCABULARY =====================
  {
    english: 'My parents live in Cairo.',
    arabic: 'يعيش والداي في القاهرة.',
    french: 'Mes parents habitent au Caire.',
    german: 'Meine Eltern leben in Kairo.',
    spanish: 'Mis padres viven en El Cairo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Her husband is a doctor.',
    arabic: 'زوجها طبيب.',
    french: 'Son mari est médecin.',
    german: 'Ihr Ehemann ist Arzt.',
    spanish: 'Su esposo es médico.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'His wife works at a school.',
    arabic: 'زوجته تعمل في مدرسة.',
    french: 'Sa femme travaille dans une école.',
    german: 'Seine Ehefrau arbeitet an einer Schule.',
    spanish: 'Su esposa trabaja en una escuela.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He lives with his spouse.',
    arabic: 'يعيش مع زوجه/زوجته.',
    french: 'Il vit avec son conjoint.',
    german: 'Er lebt mit seinem Ehepartner.',
    spanish: 'Vive con su cónyuge.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My son loves playing football.',
    arabic: 'ابني يحب لعب كرة القدم.',
    french: 'Mon fils aime jouer au football.',
    german: 'Mein Sohn spielt gerne Fußball.',
    spanish: 'A mi hijo le encanta jugar al fútbol.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Their daughter is five years old.',
    arabic: 'ابنتهما تبلغ من العمر خمس سنوات.',
    french: 'Leur fille a cinq ans.',
    german: 'Ihre Tochter ist fünf Jahre alt.',
    spanish: 'Su hija tiene cinco años.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The children are playing in the garden.',
    arabic: 'الأطفال يلعبون في الحديقة.',
    french: 'Les enfants jouent dans le jardin.',
    german: 'Die Kinder spielen im Garten.',
    spanish: 'Los niños están jugando en el jardín.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My grandmother makes delicious food.',
    arabic: 'جدتي تعد طعامًا لذيذًا.',
    french: 'Ma grand-mère prépare de délicieux plats.',
    german: 'Meine Großmutter kocht köstliches Essen.',
    spanish: 'Mi abuela cocina comida deliciosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My grandfather tells great stories.',
    arabic: 'جدي يروي قصصًا رائعة.',
    french: 'Mon grand-père raconte de superbes histoires.',
    german: 'Mein Großvater erzählt tolle Geschichten.',
    spanish: 'Mi abuelo cuenta grandes historias.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I visit my grandparents every weekend.',
    arabic: 'أزور أجدادي كل عطلة نهاية أسبوع.',
    french: 'Je rends visite à mes grands-parents chaque week-end.',
    german: 'Ich besuche meine Großeltern jedes Wochenende.',
    spanish: 'Visito a mis abuelos cada fin de semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He is very proud of his grandson.',
    arabic: 'هو فخور جدًا بحفيده.',
    french: 'Il est très fier de son petit-fils.',
    german: 'Er ist sehr stolz auf seinen Enkel.',
    spanish: 'Está muy orgulloso de su nieto.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Their granddaughter started school today.',
    arabic: 'بدأت حفيدتهم المدرسة اليوم.',
    french: "Leur petite-fille a commencé l'école aujourd'hui.",
    german: 'Ihre Enkelin hat heute mit der Schule begonnen.',
    spanish: 'Su nieta comenzó la escuela hoy.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My uncle lives abroad.',
    arabic: 'عمي/خالي يعيش في الخارج.',
    french: "Mon oncle vit à l'étranger.",
    german: 'Mein Onkel lebt im Ausland.',
    spanish: 'Mi tío vive en el extranjero.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My aunt is visiting us tomorrow.',
    arabic: 'عمتي/خالتي ستزورنا غدًا.',
    french: 'Ma tante nous rend visite demain.',
    german: 'Meine Tante besucht uns morgen.',
    spanish: 'Mi tía nos visita mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My nephew is very smart.',
    arabic: 'ابن أخي/أختي ذكي جدًا.',
    french: 'Mon neveu est très intelligent.',
    german: 'Mein Neffe ist sehr klug.',
    spanish: 'Mi sobrino es muy inteligente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My niece loves drawing and painting.',
    arabic: 'بنت أخي/أختي تحب الرسم.',
    french: 'Ma nièce adore dessiner et peindre.',
    german: 'Meine Nichte zeichnet und malt gerne.',
    spanish: 'A mi sobrina le encanta dibujar y pintar.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We are having dinner with our in-laws.',
    arabic: 'نتناول العشاء مع أهل الزوج/الزوجة.',
    french: 'Nous dînons avec nos beaux-parents.',
    german: 'Wir essen mit unseren Schwiegereltern zu Abend.',
    spanish: 'Cenamos con nuestros suegros.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Her stepmother is very kind.',
    arabic: 'زوجة أبيها لطيفة جدًا.',
    french: 'Sa belle-mère est très gentille.',
    german: 'Ihre Stiefmutter ist sehr nett.',
    spanish: 'Su madrastra es muy amable.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'His stepfather helped him build the table.',
    arabic: 'ساعده زوج أمه في صنع الطاولة.',
    french: "Son beau-père l'a aidé à fabriquer la table.",
    german: 'Sein Stiefvater half ihm, den Tisch zu bauen.',
    spanish: 'Su padrastro le ayudó a construir la mesa.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'They are identical twins.',
    arabic: 'هما توأم متطابق.',
    french: 'Ce sont des jumeaux identiques.',
    german: 'Sie sind eineiige Zwillinge.',
    spanish: 'Son gemelos idénticos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I am an only child in my family.',
    arabic: 'أنا الابن الوحيد في عائلتي.',
    french: 'Je suis enfant unique dans ma famille.',
    german: 'Ich bin ein Einzelkind in meiner Familie.',
    spanish: 'Soy hijo único en mi familia.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== EXTENDED RELATIONSHIP TERMS =====================
  {
    english: 'father-in-law',
    arabic: 'والد الزوج / والد الزوجة (الحَمَا)',
    french: 'beau-père (père du conjoint)',
    german: 'Schwiegervater',
    spanish: 'suegro',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɑːðər ɪn lɔː/',
      french: '/bo.pɛʁ/',
      german: '/ˈʃviːɡɐˌfaːtɐ/',
      spanish: '/ˈsweɣɾo/'
    }
  },
  {
    english: 'mother-in-law',
    arabic: 'والدة الزوج / والدة الزوجة (الحَمَاة)',
    french: 'belle-mère (mère du conjoint)',
    german: 'Schwiegermutter',
    spanish: 'suegra',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈmʌðər ɪn lɔː/',
      french: '/bɛl.mɛʁ/',
      german: '/ˈʃviːɡɐˌmʊtɐ/',
      spanish: '/ˈsweɣɾa/'
    }
  },
  {
    english: 'brother-in-law',
    arabic: 'أخو الزوج / أخو الزوجة (الصهر)',
    french: 'beau-frère',
    german: 'Schwager',
    spanish: 'cuñado',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbrʌðər ɪn lɔː/',
      french: '/bo.fʁɛʁ/',
      german: '/ˈʃvaːɡɐ/',
      spanish: '/kuˈɲaðo/'
    }
  },
  {
    english: 'sister-in-law',
    arabic: 'أخت الزوج / أخت الزوجة',
    french: 'belle-sœur',
    german: 'Schwägerin',
    spanish: 'cuñada',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɪstər ɪn lɔː/',
      french: '/bɛl.sœʁ/',
      german: '/ˈʃvɛːɡəʁɪn/',
      spanish: '/kuˈɲaða/'
    }
  },
  {
    english: 'partner',
    arabic: 'شريك / شريكة حياة',
    french: 'partenaire / conjoint',
    german: 'Partner / Partnerin',
    spanish: 'pareja / compañero',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈpɑːrtnər/',
      french: '/paʁ.tə.nɛʁ/',
      german: '/ˈpaʁtnɐ/',
      spanish: '/paˈɾexa/'
    }
  },
  {
    english: 'best friend',
    arabic: 'أعز صديق / صديقة',
    french: 'meilleur ami / meilleure amie',
    german: 'bester Freund / beste Freundin',
    spanish: 'mejor amigo / mejor amiga',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase',
    phonetic: {
      english: '/bɛst frɛnd/',
      french: '/mɛ.jœʁ a.mi/',
      german: '/ˈbɛstɐ fʁɔɪnt/',
      spanish: '/meˈxoɾ aˈmiɣo/'
    }
  },
  {
    english: 'extended family',
    arabic: 'العائلة الممتدة (الأقارب)',
    french: 'famille élargie',
    german: 'erweiterte Familie / Großfamilie',
    spanish: 'familia extendida',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/ɪkˈstɛndɪd ˈfæməli/',
      french: '/fa.mij e.laʁ.ʒi/',
      german: '/ɛɐ̯ˈvaɪtɐtə faˈmiːli̯ə/',
      spanish: '/faˈmilja ekstenˈdiða/'
    }
  },
  {
    english: 'look after / take care of',
    arabic: 'يعتني بـ / يهتم بـ',
    french: "s'occuper de / prendre soin de",
    german: 'sich kümmern um / aufpassen auf',
    spanish: 'cuidar de / encargarse de',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/lʊk ˈæftər/',
      french: '/sɔ.ky.pe də/',
      german: '/zɪç ˈkʏmɐn ʊm/',
      spanish: '/kwiˈðaɾ de/'
    }
  },
  {
    english: 'grow up',
    arabic: 'يكبر / ينشأ',
    french: 'grandir',
    german: 'aufwachsen',
    spanish: 'crecer',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ɡroʊ ʌp/',
      french: '/ɡʁɑ̃.diʁ/',
      german: '/ˈaʊfˌvaksn̩/',
      spanish: '/kɾeˈseɾ/'
    }
  }
];
