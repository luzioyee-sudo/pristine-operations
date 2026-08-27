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

export const WEATHER_AND_SEASONS_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY & PHENOMENA =====================
  {
    english: 'weather',
    arabic: 'الطقس',
    french: 'météo/temps',
    german: 'Wetter',
    spanish: 'clima/tiempo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɛðər/',
      french: '/me.te.o/',
      german: '/ˈvɛtɐ/',
      spanish: '/ˈklima/'
    }
  },
  {
    english: 'temperature',
    arabic: 'درجة الحرارة',
    french: 'température',
    german: 'Temperatur',
    spanish: 'temperatura',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtɛmprətʃər/',
      french: '/tɑ̃.pe.ʁa.tyʁ/',
      german: '/tɛmpəʁaˈtuːɐ̯/',
      spanish: '/tempeɾaˈtuɾa/'
    }
  },
  {
    english: 'forecast',
    arabic: 'النشرة الجوية',
    french: 'prévisions météo',
    german: 'Wettervorhersage',
    spanish: 'pronóstico',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɔːrkæst/',
      french: '/pʁe.vi.zjɔ̃ me.te.o/',
      german: '/ˈvɛtɐˌfoːɐ̯heːɐ̯ˌzaːɡə/',
      spanish: '/pɾoˈnostiko/'
    }
  },
  {
    english: 'sunny',
    arabic: 'مشمس',
    french: 'ensoleillé(e)',
    german: 'sonnig',
    spanish: 'soleado',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈsʌni/',
      french: '/ɑ̃.sɔ.lɛ.je/',
      german: '/ˈzɔnɪç/',
      spanish: '/soleˈaðo/'
    }
  },
  {
    english: 'cloudy',
    arabic: 'غائم',
    french: 'nuageux/nuageuse',
    german: 'bewölkt',
    spanish: 'nublado',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈklaʊdi/',
      french: '/nɥa.ʒø/',
      german: '/bəˈvœlkt/',
      spanish: '/nuˈβlaðo/'
    }
  },
  {
    english: 'rainy',
    arabic: 'ممطر',
    french: 'pluvieux/pluvieuse',
    german: 'regnerisch',
    spanish: 'lluvioso',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈreɪni/',
      french: '/ply.vjø/',
      german: '/ˈʁeːɡnəʁɪʃ/',
      spanish: '/ʝuˈβjoso/'
    }
  },
  {
    english: 'stormy',
    arabic: 'عاصف',
    french: 'orageux/orageuse',
    german: 'stürmisch',
    spanish: 'tormentoso',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈstɔːrmi/',
      french: '/ɔ.ʁa.ʒø/',
      german: '/ˈʃtʏʁmɪʃ/',
      spanish: '/toɾmenˈtoso/'
    }
  },
  {
    english: 'windy',
    arabic: 'عاصف بالرياح',
    french: 'venteux/venteuse',
    german: 'windig',
    spanish: 'ventoso',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈwɪndi/',
      french: '/vɑ̃.tø/',
      german: '/ˈvɪndɪç/',
      spanish: '/benˈtoso/'
    }
  },
  {
    english: 'foggy',
    arabic: 'ضبابي',
    french: 'brumeux/brumeuse',
    german: 'neblig',
    spanish: 'con niebla',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈfɒɡi/',
      french: '/bʁy.mø/',
      german: '/ˈneːblɪç/',
      spanish: '/kon ˈnjeβla/'
    }
  },
  {
    english: 'snowy',
    arabic: 'مثلج',
    french: 'neigeux/neigeuse',
    german: 'schneereich',
    spanish: 'nevado',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈsnoʊi/',
      french: '/nɛ.ʒø/',
      german: '/ˈʃneːəˌʁaɪç/',
      spanish: '/neˈβaðo/'
    }
  },
  {
    english: 'icy',
    arabic: 'جليدي',
    french: 'glacé(e)/verglacé(e)',
    german: 'eisig',
    spanish: 'helado/con hielo',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈaɪsi/',
      french: '/ɡla.se/',
      german: '/ˈaɪzɪç/',
      spanish: '/eˈlaðo/'
    }
  },
  {
    english: 'humid',
    arabic: 'رطب',
    french: 'humide',
    german: 'feucht',
    spanish: 'húmedo',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈhjuːmɪd/',
      french: '/y.mid/',
      german: '/fɔɪçt/',
      spanish: '/ˈumeðo/'
    }
  },
  {
    english: 'dry',
    arabic: 'جاف',
    french: 'sec/sèche',
    german: 'trocken',
    spanish: 'seco',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/draɪ/',
      french: '/sɛk/',
      german: '/ˈtʁɔkn̩/',
      spanish: '/ˈseko/'
    }
  },
  {
    english: 'hot',
    arabic: 'حار',
    french: 'chaud(e)',
    german: 'heiß',
    spanish: 'caluroso/caliente',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/hɒt/',
      french: '/ʃo/',
      german: '/haɪs/',
      spanish: '/kaluˈɾoso/'
    }
  },
  {
    english: 'warm',
    arabic: 'دافئ',
    french: 'chaud(e) (agréable)',
    german: 'warm',
    spanish: 'cálido',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/wɔːrm/',
      french: '/ʃo/',
      german: '/vaʁm/',
      spanish: '/ˈkaliðo/'
    }
  },
  {
    english: 'cool',
    arabic: 'معتدل البرودة',
    french: 'frais/fraîche',
    german: 'kühl',
    spanish: 'fresco',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/kuːl/',
      french: '/fʁɛ/',
      german: '/kyːl/',
      spanish: '/ˈfɾesko/'
    }
  },
  {
    english: 'cold',
    arabic: 'بارد',
    french: 'froid(e)',
    german: 'kalt',
    spanish: 'frío',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/koʊld/',
      french: '/fʁwa/',
      german: '/kalt/',
      spanish: '/ˈfɾi.o/'
    }
  },
  {
    english: 'freezing',
    arabic: 'شديد البرودة',
    french: 'glacial(e)',
    german: 'eiskalt',
    spanish: 'helado/muy frío',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈfriːzɪŋ/',
      french: '/ɡla.sjal/',
      german: '/ˈaɪsˌkalt/',
      spanish: '/eˈlaðo/'
    }
  },
  {
    english: 'sun',
    arabic: 'الشمس',
    french: 'soleil',
    german: 'Sonne',
    spanish: 'sol',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/sʌn/',
      french: '/sɔ.lɛj/',
      german: '/ˈzɔnə/',
      spanish: '/sol/'
    }
  },
  {
    english: 'rain',
    arabic: 'المطر',
    french: 'pluie',
    german: 'Regen',
    spanish: 'lluvia',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/reɪn/',
      french: '/plɥi/',
      german: '/ˈʁeːɡn̩/',
      spanish: '/ˈʝuβja/'
    }
  },
  {
    english: 'snow',
    arabic: 'الثلج',
    french: 'neige',
    german: 'Schnee',
    spanish: 'nieve',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/snoʊ/',
      french: '/nɛʒ/',
      german: '/ʃneː/',
      spanish: '/ˈnjeβe/'
    }
  },
  {
    english: 'wind',
    arabic: 'الرياح',
    french: 'vent',
    german: 'Wind',
    spanish: 'viento',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/wɪnd/',
      french: '/vɑ̃/',
      german: '/vɪnt/',
      spanish: '/ˈbjento/'
    }
  },
  {
    english: 'storm',
    arabic: 'عاصفة',
    french: 'orage/tempête',
    german: 'Sturm',
    spanish: 'tormenta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/stɔːrm/',
      french: '/tɑ̃.pɛt/',
      german: '/ʃtʊʁm/',
      spanish: '/toɾˈmenta/'
    }
  },
  {
    english: 'thunder',
    arabic: 'الرعد',
    french: 'tonnerre',
    german: 'Donner',
    spanish: 'trueno',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈθʌndər/',
      french: '/tɔ.nɛʁ/',
      german: '/ˈdɔnɐ/',
      spanish: '/ˈtɾweno/'
    }
  },
  {
    english: 'lightning',
    arabic: 'البرق',
    french: 'éclair',
    german: 'Blitz',
    spanish: 'rayo',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈlaɪtnɪŋ/',
      french: '/e.klɛʁ/',
      german: '/blɪts/',
      spanish: '/ˈraʝo/'
    }
  },
  {
    english: 'cloud',
    arabic: 'سحابة',
    french: 'nuage',
    german: 'Wolke',
    spanish: 'nube',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/klaʊd/',
      french: '/nɥaʒ/',
      german: '/ˈvɔlkə/',
      spanish: '/ˈnuβe/'
    }
  },
  {
    english: 'sky',
    arabic: 'السماء',
    french: 'ciel',
    german: 'Himmel',
    spanish: 'cielo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/skaɪ/',
      french: '/sjɛl/',
      german: '/ˈhɪml̩/',
      spanish: '/ˈsjelo/'
    }
  },
  {
    english: 'rainbow',
    arabic: 'قوس قزح',
    french: 'arc-en-ciel',
    german: 'Regenbogen',
    spanish: 'arcoíris',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈreɪnboʊ/',
      french: '/aʁk.ɑ̃.sjɛl/',
      german: '/ˈʁeːɡn̩ˌboːɡn̩/',
      spanish: '/aɾkoˈiɾis/'
    }
  },
  {
    english: 'umbrella',
    arabic: 'مظلة',
    french: 'parapluie',
    german: 'Regenschirm',
    spanish: 'paraguas',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ʌmˈbrɛlə/',
      french: '/pa.ʁa.plɥi/',
      german: '/ˈʁeːɡn̩ˌʃɪʁm/',
      spanish: '/paˈɾaɣwas/'
    }
  },
  {
    english: 'spring',
    arabic: 'الربيع',
    french: 'printemps',
    german: 'Frühling',
    spanish: 'primavera',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/sprɪŋ/',
      french: '/pʁɛ̃.tɑ̃/',
      german: '/ˈfʁyːlɪŋ/',
      spanish: '/pɾimaˈβeɾa/'
    }
  },
  {
    english: 'summer',
    arabic: 'الصيف',
    french: 'été',
    german: 'Sommer',
    spanish: 'verano',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsʌmər/',
      french: '/e.te/',
      german: '/ˈzɔmɐ/',
      spanish: '/beˈɾano/'
    }
  },
  {
    english: 'autumn / fall',
    arabic: 'الخريف',
    french: 'automne',
    german: 'Herbst',
    spanish: 'otoño',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɔːtəm / fɔːl/',
      french: '/o.tɔn/',
      german: '/hɛʁpst/',
      spanish: '/oˈtoɲo/'
    }
  },
  {
    english: 'winter',
    arabic: 'الشتاء',
    french: 'hiver',
    german: 'Winter',
    spanish: 'invierno',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɪntər/',
      french: '/i.vɛʁ/',
      german: '/ˈvɪntɐ/',
      spanish: '/imˈbjeɾno/'
    }
  },
  {
    english: 'season',
    arabic: 'فصل',
    french: 'saison',
    german: 'Jahreszeit',
    spanish: 'estación',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsiːzən/',
      french: '/sɛ.zɔ̃/',
      german: '/ˈjaːʁəsˌtsaɪt/',
      spanish: '/estaˈsjon/'
    }
  },
  {
    english: 'climate',
    arabic: 'المناخ',
    french: 'climat',
    german: 'Klima',
    spanish: 'clima',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈklaɪmɪt/',
      french: '/kli.ma/',
      german: '/ˈkliːma/',
      spanish: '/ˈklima/'
    }
  },
  {
    english: 'mild',
    arabic: 'معتدل',
    french: 'doux/douce',
    german: 'mild',
    spanish: 'templado',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/maɪld/',
      french: '/du/',
      german: '/mɪlt/',
      spanish: '/temˈplaðo/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: 'What’s the weather like today?',
    arabic: 'كيف هو الطقس اليوم؟',
    french: "Quel temps fait-il aujourd'hui ?",
    german: 'Wie ist das Wetter heute?',
    spanish: '¿Qué tiempo hace hoy?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The temperature is very high today.',
    arabic: 'درجة الحرارة مرتفعة جدًا اليوم.',
    french: "La température est très élevée aujourd'hui.",
    german: 'Die Temperatur ist heute sehr hoch.',
    spanish: 'La temperatura es muy alta hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The forecast says it will rain.',
    arabic: 'تقول النشرة الجوية إنها ستمطر.',
    french: 'Les prévisions annoncent de la pluie.',
    german: 'Die Wettervorhersage sagt Regen voraus.',
    spanish: 'El pronóstico dice que lloverá.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'It’s sunny today.',
    arabic: 'الجو مشمس اليوم.',
    french: "Il fait soleil aujourd'hui.",
    german: 'Heute ist es sonnig.',
    spanish: 'Hoy está soleado.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The sky is cloudy.',
    arabic: 'السماء غائمة.',
    french: 'Le ciel est nuageux.',
    german: 'Der Himmel ist bewölkt.',
    spanish: 'El cielo está nublado.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s a rainy day.',
    arabic: 'إنه يوم ممطر.',
    french: "C'est une journée pluvieuse.",
    german: 'Es ist ein regnerischer Tag.',
    spanish: 'Es un día lluvioso.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s stormy outside tonight.',
    arabic: 'الجو عاصف بالخارج الليلة.',
    french: "Il y a de l'orage dehors ce soir.",
    german: 'Draußen ist es heute Abend stürmisch.',
    spanish: 'Esta noche hay tormenta afuera.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'It’s very windy outside.',
    arabic: 'الجو عاصف بالرياح بالخارج.',
    french: 'Il y a beaucoup de vent dehors.',
    german: 'Draußen ist es sehr windig.',
    spanish: 'Hace mucho viento afuera.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s foggy this morning.',
    arabic: 'الجو ضبابي هذا الصباح.',
    french: 'Il y a du brouillard ce matin.',
    german: 'Heute Morgen ist es neblig.',
    spanish: 'Hay niebla esta mañana.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'It’s snowy in the mountains.',
    arabic: 'الجبال مثلجة.',
    french: 'Il neige dans les montagnes.',
    german: 'In den Bergen ist es schneereich.',
    spanish: 'Está nevado en las montañas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The roads are icy today.',
    arabic: 'الطرق جليدية اليوم.',
    french: "Les routes sont verglacées aujourd'hui.",
    german: 'Die Straßen sind heute vereist.',
    spanish: 'Las carreteras están heladas hoy.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'It’s very humid in summer.',
    arabic: 'الجو رطب جدًا في الصيف.',
    french: 'Il fait très humide en été.',
    german: 'Im Sommer ist es sehr feucht.',
    spanish: 'Hace mucha humedad en verano.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The weather is dry this season.',
    arabic: 'الطقس جاف هذا الفصل.',
    french: 'Le temps est sec cette saison.',
    german: 'Das Wetter ist diese Saison trocken.',
    spanish: 'El clima está seco esta temporada.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s hot in summer.',
    arabic: 'الجو حار في الصيف.',
    french: 'Il fait chaud en été.',
    german: 'Im Sommer ist es heiß.',
    spanish: 'Hace calor en verano.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s warm this afternoon.',
    arabic: 'الجو دافئ بعد الظهر.',
    french: 'Il fait doux cet après-midi.',
    german: 'Heute Nachmittag ist es warm.',
    spanish: 'Hace calor templado esta tarde.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The evening is cool.',
    arabic: 'المساء معتدل البرودة.',
    french: 'La soirée est fraîche.',
    german: 'Der Abend ist kühl.',
    spanish: 'La tarde está fresca.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s cold in winter.',
    arabic: 'الجو بارد في الشتاء.',
    french: 'Il fait froid en hiver.',
    german: 'Im Winter ist es kalt.',
    spanish: 'Hace frío en invierno.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s freezing outside!',
    arabic: 'الجو شديد البرودة بالخارج!',
    french: 'Il gèle dehors !',
    german: 'Draußen ist es eiskalt!',
    spanish: '¡Hace un frío helado afuera!',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The sun is shining today.',
    arabic: 'الشمس مشرقة اليوم.',
    french: "Le soleil brille aujourd'hui.",
    german: 'Heute scheint die Sonne.',
    spanish: 'El sol brilla hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We need some rain.',
    arabic: 'نحتاج إلى بعض المطر.',
    french: 'Nous avons besoin de pluie.',
    german: 'Wir brauchen etwas Regen.',
    spanish: 'Necesitamos algo de lluvia.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The snow is beautiful.',
    arabic: 'الثلج جميل.',
    french: 'La neige est belle.',
    german: 'Der Schnee ist schön.',
    spanish: 'La nieve es hermosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The wind is strong today.',
    arabic: 'الرياح قوية اليوم.',
    french: "Le vent est fort aujourd'hui.",
    german: 'Der Wind ist heute stark.',
    spanish: 'El viento es fuerte hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'A storm is coming.',
    arabic: 'عاصفة قادمة.',
    french: 'Une tempête arrive.',
    german: 'Ein Sturm zieht auf.',
    spanish: 'Se acerca una tormenta.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I heard thunder last night.',
    arabic: 'سمعت الرعد الليلة الماضية.',
    french: "J'ai entendu le tonnerre la nuit dernière.",
    german: 'Ich habe letzte Nacht Donner gehört.',
    spanish: 'Escuché truenos anoche.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The lightning was very bright.',
    arabic: 'كان البرق ساطعًا جدًا.',
    french: "L'éclair était très lumineux.",
    german: 'Der Blitz war sehr hell.',
    spanish: 'El rayo fue muy brillante.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'There’s a big cloud in the sky.',
    arabic: 'هناك سحابة كبيرة في السماء.',
    french: 'Il y a un gros nuage dans le ciel.',
    german: 'Da ist eine große Wolke am Himmel.',
    spanish: 'Hay una nube grande en el cielo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The sky is blue today.',
    arabic: 'السماء زرقاء اليوم.',
    french: "Le ciel est bleu aujourd'hui.",
    german: 'Der Himmel ist heute blau.',
    spanish: 'El cielo está azul hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We saw a rainbow after the rain.',
    arabic: 'رأينا قوس قزح بعد المطر.',
    french: 'Nous avons vu un arc-en-ciel après la pluie.',
    german: 'Wir haben nach dem Regen einen Regenbogen gesehen.',
    spanish: 'Vimos un arcoíris después de la lluvia.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Take your umbrella with you.',
    arabic: 'خذ مظلتك معك.',
    french: 'Prends ton parapluie avec toi.',
    german: 'Nimm deinen Regenschirm mit.',
    spanish: 'Lleva tu paraguas contigo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Spring is my favorite season.',
    arabic: 'الربيع هو فصلي المفضل.',
    french: 'Le printemps est ma saison préférée.',
    german: 'Frühling ist meine Lieblingsjahreszeit.',
    spanish: 'La primavera es mi estación favorita.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Summer is very hot here.',
    arabic: 'الصيف حار جدًا هنا.',
    french: "L'été est très chaud ici.",
    german: 'Der Sommer ist hier sehr heiß.',
    spanish: 'El verano es muy caluroso aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Leaves fall in autumn.',
    arabic: 'تتساقط الأوراق في الخريف.',
    french: 'Les feuilles tombent en automne.',
    german: 'Im Herbst fallen die Blätter.',
    spanish: 'Las hojas caen en otoño.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Winter is short this year.',
    arabic: 'الشتاء قصير هذا العام.',
    french: "L'hiver est court cette année.",
    german: 'Der Winter ist dieses Jahr kurz.',
    spanish: 'El invierno es corto este año.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My favorite season is spring.',
    arabic: 'فصلي المفضل هو الربيع.',
    french: 'Ma saison préférée est le printemps.',
    german: 'Meine Lieblingsjahreszeit ist der Frühling.',
    spanish: 'Mi estación favorita es la primavera.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The climate here is dry.',
    arabic: 'المناخ هنا جاف.',
    french: 'Le climat ici est sec.',
    german: 'Das Klima hier ist trocken.',
    spanish: 'El clima aquí es seco.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The weather is mild today.',
    arabic: 'الطقس معتدل اليوم.',
    french: "Le temps est doux aujourd'hui.",
    german: 'Das Wetter ist heute mild.',
    spanish: 'El clima está templado hoy.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS =====================
  {
    english: 'What’s the weather like?',
    arabic: 'كيف هو الطقس؟',
    french: 'Quel temps fait-il ?',
    german: 'Wie ist das Wetter?',
    spanish: '¿Qué tiempo hace?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s raining',
    arabic: 'إنها تمطر',
    french: 'Il pleut',
    german: 'Es regnet',
    spanish: 'Está lloviendo',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s really hot today',
    arabic: 'الجو حار جدًا اليوم',
    french: "Il fait vraiment chaud aujourd'hui",
    german: 'Heute ist es wirklich heiß',
    spanish: 'Hoy hace mucho calor',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I love the summer',
    arabic: 'أحب فصل الصيف',
    french: "J'adore l'été",
    german: 'Ich liebe den Sommer',
    spanish: 'Me encanta el verano',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Don’t forget your umbrella',
    arabic: 'لا تنسَ مظلتك',
    french: "N'oublie pas ton parapluie",
    german: 'Vergiss deinen Regenschirm nicht',
    spanish: 'No olvides tu paraguas',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The weather is nice',
    arabic: 'الطقس جميل',
    french: 'Il fait beau',
    german: 'Das Wetter ist schön',
    spanish: 'Hace buen tiempo',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It looks like it’s going to rain',
    arabic: 'يبدو أنها ستمطر',
    french: "On dirait qu'il va pleuvoir",
    german: 'Es sieht nach Regen aus',
    spanish: 'Parece que va a llover',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'What’s the temperature today?',
    arabic: 'كم درجة الحرارة اليوم؟',
    french: "Quelle est la température aujourd'hui ?",
    german: 'Wie hoch ist die Temperatur heute?',
    spanish: '¿Qué temperatura hace hoy?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'It’s freezing outside',
    arabic: 'الجو شديد البرودة بالخارج',
    french: 'Il gèle dehors',
    german: 'Draußen ist es eiskalt',
    spanish: 'Hace un frío helado afuera',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL WEATHER PHRASES & ADVERBS =====================
  {
    english: 'degrees Celsius',
    arabic: 'درجة مئوية',
    french: 'degrés Celsius',
    german: 'Grad Celsius',
    spanish: 'grados Celsius',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈɡriːz ˈsɛlsiəs/',
      french: '/də.ɡʁe sɛl.sjys/',
      german: '/ɡʁaːt ˈtsɛlziʊs/',
      spanish: '/ˈɡɾaðos ˈselsjus/'
    }
  },
  {
    english: 'heavy rain',
    arabic: 'مطر غزير',
    french: 'pluie battante / forte pluie',
    german: 'Starkregen',
    spanish: 'lluvia fuerte',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈhɛvi reɪn/',
      french: '/fɔʁt plɥi/',
      german: '/ˈʃtaʁkˌʁeːɡn̩/',
      spanish: '/ˈʝuβja ˈfweɾte/'
    }
  },
  {
    english: 'clear sky',
    arabic: 'سماء صافية',
    french: 'ciel dégagé',
    german: 'klarer Himmel',
    spanish: 'cielo despejado',
    type: 'chunk',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/klɪər skaɪ/',
      french: '/sjɛl de.ɡa.ʒe/',
      german: '/ˈklaːʁɐ ˈhɪml̩/',
      spanish: '/ˈsjelo despeˈxaðo/'
    }
  },
  {
    english: 'heatwave',
    arabic: 'موجة حارة',
    french: 'vague de chaleur / canicule',
    german: 'Hitzewelle',
    spanish: 'ola de calor',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈhiːtweɪv/',
      french: '/ka.ni.kyl/',
      german: '/ˈhɪtsəˌvɛlə/',
      spanish: '/ˈola ðe kaˈloɾ/'
    }
  }
];
