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

export const HOBBIES_AND_FREE_TIME_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY & ACTIVITIES =====================
  {
    english: 'hobby',
    arabic: 'هواية',
    french: 'passe-temps',
    german: 'Hobby',
    spanish: 'pasatiempo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈhɒbi/',
      french: '/pas.tɑ̃/',
      german: '/ˈhɔbi/',
      spanish: '/pasaˈtjempo/'
    }
  },
  {
    english: 'free time / leisure',
    arabic: 'وقت الفراغ',
    french: 'temps libre',
    german: 'Freizeit',
    spanish: 'tiempo libre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/friː taɪm / ˈlɛʒər/',
      french: '/tɑ̃ libʁ/',
      german: '/ˈfʁaɪˌtsaɪt/',
      spanish: '/ˈtjempo ˈliβɾe/'
    }
  },
  {
    english: 'interest',
    arabic: 'اهتمام',
    french: 'intérêt',
    german: 'Interesse',
    spanish: 'interés',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɪntrəst/',
      french: '/ɛ̃.te.ʁɛ/',
      german: '/ɪntəˈʁɛsə/',
      spanish: '/inteˈɾes/'
    }
  },
  {
    english: 'reading',
    arabic: 'القراءة',
    french: 'la lecture',
    german: 'Lesen',
    spanish: 'lectura',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈriːdɪŋ/',
      french: '/lɛk.tyʁ/',
      german: '/ˈleːzn̩/',
      spanish: '/lekˈtuɾa/'
    }
  },
  {
    english: 'writing',
    arabic: 'الكتابة',
    french: "l'écriture",
    german: 'Schreiben',
    spanish: 'escritura',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈraɪtɪŋ/',
      french: '/e.kʁi.tyʁ/',
      german: '/ˈʃʁaɪbn̩/',
      spanish: '/eskɾiˈtuɾa/'
    }
  },
  {
    english: 'drawing',
    arabic: 'الرسم بالقلم',
    french: 'le dessin',
    german: 'Zeichnen',
    spanish: 'dibujo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdrɔːɪŋ/',
      french: '/de.sɛ̃/',
      german: '/ˈtsaɪçnən/',
      spanish: '/diˈβuxo/'
    }
  },
  {
    english: 'painting',
    arabic: 'الرسم بالألوان',
    french: 'la peinture',
    german: 'Malen',
    spanish: 'pintura',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈpeɪntɪŋ/',
      french: '/pɛ̃.tyʁ/',
      german: '/ˈmaːlən/',
      spanish: '/pinˈtuɾa/'
    }
  },
  {
    english: 'singing',
    arabic: 'الغناء',
    french: 'le chant',
    german: 'Singen',
    spanish: 'canto',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɪŋɪŋ/',
      french: '/ʃɑ̃/',
      german: '/ˈzɪŋən/',
      spanish: '/ˈkanto/'
    }
  },
  {
    english: 'dancing',
    arabic: 'الرقص',
    french: 'la danse',
    german: 'Tanzen',
    spanish: 'baile',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɑːnsɪŋ/',
      french: '/dɑ̃s/',
      german: '/ˈtantsn̩/',
      spanish: '/ˈbajle/'
    }
  },
  {
    english: 'playing an instrument',
    arabic: 'العزف على آلة موسيقية',
    french: "jouer d'un instrument",
    german: 'ein Instrument spielen',
    spanish: 'tocar un instrumento',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈpleɪɪŋ ən ˈɪnstrəmənt/',
      french: '/ʒwe dœ̃.n‿ɛ̃s.tʁy.mɑ̃/',
      german: '/aɪn ɪnstʁuˈmɛnt ˈʃpiːlən/',
      spanish: '/toˈkaɾ un instɾuˈmento/'
    }
  },
  {
    english: 'guitar',
    arabic: 'جيتار',
    french: 'guitare',
    german: 'Gitarre',
    spanish: 'guitarra',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ɡɪˈtɑːr/',
      french: '/ɡi.taʁ/',
      german: '/ɡiˈtaʁə/',
      spanish: '/ɡiˈtara/'
    }
  },
  {
    english: 'piano',
    arabic: 'بيانو',
    french: 'piano',
    german: 'Klavier',
    spanish: 'piano',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/piˈænoʊ/',
      french: '/pja.no/',
      german: '/klaˈviːɐ̯/',
      spanish: '/ˈpjano/'
    }
  },
  {
    english: 'listening to music',
    arabic: 'الاستماع للموسيقى',
    french: 'écouter de la musique',
    german: 'Musik hören',
    spanish: 'escuchar música',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈlɪsnɪŋ tuː ˈmjuːzɪk/',
      french: '/e.ku.te də la my.zik/',
      german: '/muˈziːk ˈhøːʁən/',
      spanish: '/eskuˈtʃaɾ ˈmusika/'
    }
  },
  {
    english: 'watching movies',
    arabic: 'مشاهدة الأفلام',
    french: 'regarder des films',
    german: 'Filme schauen',
    spanish: 'ver películas',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈwɒtʃɪŋ ˈmuːviz/',
      french: '/ʁə.ɡaʁ.de de film/',
      german: '/ˈfɪlmə ˈʃaʊən/',
      spanish: '/beɾ peˈlikulas/'
    }
  },
  {
    english: 'watching TV series',
    arabic: 'مشاهدة المسلسلات',
    french: 'regarder des séries',
    german: 'Serien schauen',
    spanish: 'ver series',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈwɒtʃɪŋ ˌtiːˈviː ˈsɪəriːz/',
      french: '/ʁə.ɡaʁ.de de se.ʁi/',
      german: '/ˈzeːʁiən ˈʃaʊən/',
      spanish: '/beɾ ˈseɾjes/'
    }
  },
  {
    english: 'playing video games',
    arabic: 'لعب ألعاب الفيديو',
    french: 'jouer aux jeux vidéo',
    german: 'Videospiele spielen',
    spanish: 'jugar videojuegos',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈpleɪɪŋ ˈvɪdioʊ ɡeɪmz/',
      french: '/ʒwe o ʒø vi.de.o/',
      german: '/ˈviːdeoːˌʃpiːlə ˈʃpiːlən/',
      spanish: '/xuˈɣaɾ biðeoˈxweɣos/'
    }
  },
  {
    english: 'playing sports',
    arabic: 'ممارسة الرياضة',
    french: 'faire du sport',
    german: 'Sport treiben',
    spanish: 'practicar deportes',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈpleɪɪŋ spɔːrts/',
      french: '/fɛʁ dy spɔʁ/',
      german: '/ʃpɔʁt ˈtʁaɪbn̩/',
      spanish: '/pɾaktiˈkaɾ deˈpoɾtes/'
    }
  },
  {
    english: 'football',
    arabic: 'كرة القدم',
    french: 'football',
    german: 'Fußball',
    spanish: 'fútbol',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfʊtbɔːl/',
      french: '/fut.bɔl/',
      german: '/ˈfuːsˌbal/',
      spanish: '/ˈfuðβol/'
    }
  },
  {
    english: 'basketball',
    arabic: 'كرة السلة',
    french: 'basketball',
    german: 'Basketball',
    spanish: 'baloncesto',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbæskɪtbɔːl/',
      french: '/bas.kɛt.bɔl/',
      german: '/ˈbaːskətˌbal/',
      spanish: '/balonˈsesto/'
    }
  },
  {
    english: 'swimming',
    arabic: 'السباحة',
    french: 'la natation',
    german: 'Schwimmen',
    spanish: 'natación',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈswɪmɪŋ/',
      french: '/na.ta.sjɔ̃/',
      german: '/ˈʃvɪmən/',
      spanish: '/nataˈsjon/'
    }
  },
  {
    english: 'running / jogging',
    arabic: 'الجري',
    french: 'la course à pied',
    german: 'Joggen',
    spanish: 'correr',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈrʌnɪŋ / ˈdʒɒɡɪŋ/',
      french: '/kuʁs a pje/',
      german: '/ˈdʒɔɡn̩/',
      spanish: '/koˈreɾ/'
    }
  },
  {
    english: 'cycling',
    arabic: 'ركوب الدراجة',
    french: 'le cyclisme',
    german: 'Radfahren',
    spanish: 'ciclismo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsaɪklɪŋ/',
      french: '/si.klism/',
      german: '/ˈʁaːtˌfaːʁən/',
      spanish: '/siˈklizmo/'
    }
  },
  {
    english: 'hiking',
    arabic: 'المشي لمسافات طويلة',
    french: 'la randonnée',
    german: 'Wandern',
    spanish: 'senderismo',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈhaɪkɪŋ/',
      french: '/ʁɑ̃.dɔ.ne/',
      german: '/ˈvandɐn/',
      spanish: '/sendeˈɾizmo/'
    }
  },
  {
    english: 'camping',
    arabic: 'التخييم',
    french: 'le camping',
    german: 'Camping',
    spanish: 'acampada',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈkæmpɪŋ/',
      french: '/kam.piŋ/',
      german: '/ˈkɛmpɪŋ/',
      spanish: '/akamˈpaða/'
    }
  },
  {
    english: 'fishing',
    arabic: 'صيد السمك',
    french: 'la pêche',
    german: 'Angeln',
    spanish: 'pesca',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɪʃɪŋ/',
      french: '/pɛʃ/',
      german: '/ˈaŋl̩n/',
      spanish: '/ˈpeska/'
    }
  },
  {
    english: 'gardening',
    arabic: 'البستنة',
    french: 'le jardinage',
    german: 'Gärtnern',
    spanish: 'jardinería',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡɑːrdnɪŋ/',
      french: '/ʒaʁ.di.naʒ/',
      german: '/ˈɡɛʁtnɐn/',
      spanish: '/xaɾðineˈɾi.a/'
    }
  },
  {
    english: 'cooking',
    arabic: 'الطبخ',
    french: 'la cuisine',
    german: 'Kochen',
    spanish: 'cocina',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkʊkɪŋ/',
      french: '/kɥi.zin/',
      german: '/ˈkɔxn̩/',
      spanish: '/koˈsina/'
    }
  },
  {
    english: 'baking',
    arabic: 'الخبز (الحلويات)',
    french: 'la pâtisserie',
    german: 'Backen',
    spanish: 'repostería',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbeɪkɪŋ/',
      french: '/pa.ti.sʁi/',
      german: '/ˈbakn̩/',
      spanish: '/reposteˈɾi.a/'
    }
  },
  {
    english: 'photography',
    arabic: 'التصوير الفوتوغرافي',
    french: 'la photographie',
    german: 'Fotografie',
    spanish: 'fotografía',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/fəˈtɒɡrəfi/',
      french: '/fɔ.tɔ.ɡʁa.fi/',
      german: '/fotoɡʁaˈfiː/',
      spanish: '/fotaɣɾaˈfi.a/'
    }
  },
  {
    english: 'traveling',
    arabic: 'السفر',
    french: 'les voyages',
    german: 'Reisen',
    spanish: 'viajar',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtrævəlɪŋ/',
      french: '/vwa.jaʒ/',
      german: '/ˈʁaɪzn̩/',
      spanish: '/bjaˈxaɾ/'
    }
  },
  {
    english: 'collecting (stamps/coins)',
    arabic: 'جمع (الطوابع/العملات)',
    french: 'la collection (timbres/pièces)',
    german: 'Sammeln (Briefmarken/Münzen)',
    spanish: 'coleccionar (sellos/monedas)',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/kəˈlɛktɪŋ/',
      french: '/kɔ.lɛk.sjɔ̃/',
      german: '/ˈzaml̩n/',
      spanish: '/koleksjoˈnaɾ/'
    }
  },
  {
    english: 'chess',
    arabic: 'الشطرنج',
    french: 'les échecs',
    german: 'Schach',
    spanish: 'ajedrez',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/tʃɛs/',
      french: '/e.ʃɛk/',
      german: '/ʃax/',
      spanish: '/axeˈðɾes/'
    }
  },
  {
    english: 'board games',
    arabic: 'ألعاب الطاولة',
    french: 'jeux de société',
    german: 'Brettspiele',
    spanish: 'juegos de mesa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bɔːrd ɡeɪmz/',
      french: '/ʒø də sɔ.sje.te/',
      german: '/ˈbʁɛtˌʃpiːlə/',
      spanish: '/ˈxweɣos de ˈmesa/'
    }
  },
  {
    english: 'puzzles',
    arabic: 'الألغاز',
    french: 'puzzles',
    german: 'Puzzles/Rätsel',
    spanish: 'rompecabezas',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈpʌzlz/',
      french: '/pœzl/',
      german: '/ˈpatsl̩/',
      spanish: '/rompekaˈβesas/'
    }
  },
  {
    english: 'gym',
    arabic: 'النادي الرياضي',
    french: 'salle de sport',
    german: 'Fitnessstudio',
    spanish: 'gimnasio',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dʒɪm/',
      french: '/sal də spɔʁ/',
      german: '/ˈfɪtnəsˌʃtuːdioː/',
      spanish: '/ximˈnasjo/'
    }
  },
  {
    english: 'yoga',
    arabic: 'اليوغا',
    french: 'yoga',
    german: 'Yoga',
    spanish: 'yoga',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈjoʊɡə/',
      french: '/jɔ.ɡa/',
      german: '/ˈjoːɡa/',
      spanish: '/ˈʝoɣa/'
    }
  },
  {
    english: 'weekend',
    arabic: 'عطلة نهاية الأسبوع',
    french: 'week-end',
    german: 'Wochenende',
    spanish: 'fin de semana',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwiːkɛnd/',
      french: '/wi.kɛnd/',
      german: '/ˈvɔxn̩ˌʔɛndə/',
      spanish: '/fin de seˈmana/'
    }
  },
  {
    english: 'relax',
    arabic: 'يسترخي',
    french: 'se détendre',
    german: 'sich entspannen',
    spanish: 'relajarse',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/rɪˈlæks/',
      french: '/sə de.tɑ̃dʁ/',
      german: '/zɪç ɛntˈʃpanən/',
      spanish: '/relaˈxaɾse/'
    }
  },
  {
    english: 'club',
    arabic: 'نادٍ',
    french: 'club',
    german: 'Verein/Klub',
    spanish: 'club',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/klʌb/',
      french: '/klœb/',
      german: '/klʊp/',
      spanish: '/klub/'
    }
  },
  {
    english: 'team',
    arabic: 'فريق',
    french: 'équipe',
    german: 'Team/Mannschaft',
    spanish: 'equipo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/tiːm/',
      french: '/e.kip/',
      german: '/tiːm/',
      spanish: '/eˈkipo/'
    }
  },
  {
    english: 'competition',
    arabic: 'مسابقة',
    french: 'compétition',
    german: 'Wettbewerb',
    spanish: 'competencia',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˌkɒmpəˈtɪʃən/',
      french: '/kɔ̃.pe.ti.sjɔ̃/',
      german: '/ˈvɛtbəˌvɛʁp/',
      spanish: '/kompeˈtensja/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: 'Football is my hobby.',
    arabic: 'كرة القدم هي هوايتي.',
    french: 'Le football est mon passe-temps.',
    german: 'Fußball ist mein Hobby.',
    spanish: 'El fútbol es mi pasatiempo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I read in my free time.',
    arabic: 'أقرأ في وقت فراغي.',
    french: 'Je lis pendant mon temps libre.',
    german: 'Ich lese in meiner Freizeit.',
    spanish: 'Leo en mi tiempo libre.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My interests include music.',
    arabic: 'تشمل اهتماماتي الموسيقى.',
    french: 'Mes intérêts incluent la musique.',
    german: 'Zu meinen Interessen gehört Musik.',
    spanish: 'Mis intereses incluyen la música.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Reading is relaxing.',
    arabic: 'القراءة مريحة.',
    french: 'La lecture est relaxante.',
    german: 'Lesen ist entspannend.',
    spanish: 'Leer es relajante.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She enjoys writing stories.',
    arabic: 'تستمتع بكتابة القصص.',
    french: 'Elle aime écrire des histoires.',
    german: 'Sie schreibt gerne Geschichten.',
    spanish: 'A ella le gusta escribir historias.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He is good at drawing.',
    arabic: 'هو ماهر في الرسم.',
    french: 'Il dessine bien.',
    german: 'Er kann gut zeichnen.',
    spanish: 'Él dibuja bien.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Painting is her passion.',
    arabic: 'الرسم هو شغفها.',
    french: 'La peinture est sa passion.',
    german: 'Malen ist ihre Leidenschaft.',
    spanish: 'La pintura es su pasión.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'She loves singing.',
    arabic: 'تحب الغناء.',
    french: 'Elle adore chanter.',
    german: 'Sie liebt es zu singen.',
    spanish: 'A ella le encanta cantar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'They enjoy dancing together.',
    arabic: 'يستمتعان بالرقص معًا.',
    french: 'Ils aiment danser ensemble.',
    german: 'Sie tanzen gerne zusammen.',
    spanish: 'Disfrutan bailando juntos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He plays an instrument well.',
    arabic: 'يعزف على آلة موسيقية بشكل جيد.',
    french: "Il joue bien d'un instrument.",
    german: 'Er spielt gut ein Instrument.',
    spanish: 'Él toca bien un instrumento.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m learning to play the guitar.',
    arabic: 'أتعلم العزف على الجيتار.',
    french: "J'apprends à jouer de la guitare.",
    german: 'Ich lerne Gitarre zu spielen.',
    spanish: 'Estoy aprendiendo a tocar la guitarra.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She plays the piano beautifully.',
    arabic: 'تعزف على البيانو بشكل جميل.',
    french: 'Elle joue magnifiquement du piano.',
    german: 'Sie spielt wunderschön Klavier.',
    spanish: 'Ella toca el piano maravillosamente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I enjoy listening to music.',
    arabic: 'أستمتع بالاستماع للموسيقى.',
    french: "J'aime écouter de la musique.",
    german: 'Ich höre gerne Musik.',
    spanish: 'Disfruto escuchando música.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We love watching movies.',
    arabic: 'نحب مشاهدة الأفلام.',
    french: 'Nous adorons regarder des films.',
    german: 'Wir sehen gerne Filme.',
    spanish: 'Nos encanta ver películas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m watching a new TV series.',
    arabic: 'أشاهد مسلسلاً جديدًا.',
    french: 'Je regarde une nouvelle série.',
    german: 'Ich schaue eine neue Serie.',
    spanish: 'Estoy viendo una nueva serie.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He spends his evenings gaming.',
    arabic: 'يقضي أمسياته في لعب ألعاب الفيديو.',
    french: 'Il passe ses soirées à jouer aux jeux vidéo.',
    german: 'Er verbringt seine Abende mit Videospielen.',
    spanish: 'Pasa sus tardes jugando videojuegos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I enjoy playing sports.',
    arabic: 'أستمتع بممارسة الرياضة.',
    french: "J'aime faire du sport.",
    german: 'Ich treibe gerne Sport.',
    spanish: 'Disfruto practicando deportes.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I play football every weekend.',
    arabic: 'ألعب كرة القدم كل عطلة أسبوعية.',
    french: 'Je joue au football chaque week-end.',
    german: 'Ich spiele jedes Wochenende Fußball.',
    spanish: 'Juego fútbol cada fin de semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He plays basketball with friends.',
    arabic: 'يلعب كرة السلة مع أصدقائه.',
    french: 'Il joue au basketball avec ses amis.',
    german: 'Er spielt Basketball mit Freunden.',
    spanish: 'Juega baloncesto con amigos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I go swimming twice a week.',
    arabic: 'أذهب للسباحة مرتين أسبوعيًا.',
    french: 'Je vais nager deux fois par semaine.',
    german: 'Ich gehe zweimal die Woche schwimmen.',
    spanish: 'Voy a nadar dos veces por semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I go running every morning.',
    arabic: 'أذهب للجري كل صباح.',
    french: 'Je fais du jogging tous les matins.',
    german: 'Ich gehe jeden Morgen joggen.',
    spanish: 'Salgo a correr cada mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Cycling is good exercise.',
    arabic: 'ركوب الدراجة تمرين جيد.',
    french: 'Le vélo est un bon exercice.',
    german: 'Radfahren ist ein gutes Training.',
    spanish: 'El ciclismo es un buen ejercicio.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We went hiking last weekend.',
    arabic: 'ذهبنا للمشي لمسافات طويلة عطلة الأسبوع الماضية.',
    french: 'Nous avons fait de la randonnée le week-end dernier.',
    german: 'Wir waren letztes Wochenende wandern.',
    spanish: 'Fuimos de senderismo el fin de semana pasado.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We went camping in the desert.',
    arabic: 'ذهبنا للتخييم في الصحراء.',
    french: 'Nous sommes allés camper dans le désert.',
    german: 'Wir waren in der Wüste campen.',
    spanish: 'Fuimos a acampar en el desierto.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My father enjoys fishing.',
    arabic: 'يستمتع أبي بصيد السمك.',
    french: 'Mon père aime pêcher.',
    german: 'Mein Vater angelt gerne.',
    spanish: 'A mi padre le gusta pescar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My mother loves gardening.',
    arabic: 'تحب أمي البستنة.',
    french: 'Ma mère adore le jardinage.',
    german: 'Meine Mutter liebt Gärtnern.',
    spanish: 'A mi madre le encanta la jardinería.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I enjoy cooking new recipes.',
    arabic: 'أستمتع بطبخ وصفات جديدة.',
    french: "J'aime cuisiner de nouvelles recettes.",
    german: 'Ich koche gerne neue Rezepte.',
    spanish: 'Disfruto cocinando nuevas recetas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Baking cakes is fun.',
    arabic: 'خبز الكعك ممتع.',
    french: "Faire des gâteaux, c'est amusant.",
    german: 'Kuchenbacken macht Spaß.',
    spanish: 'Hornear pasteles es divertido.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Photography is a great hobby.',
    arabic: 'التصوير هواية رائعة.',
    french: 'La photographie est un excellent passe-temps.',
    german: 'Fotografie ist ein tolles Hobby.',
    spanish: 'La fotografía es un excelente pasatiempo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Traveling teaches you a lot.',
    arabic: 'السفر يعلمك الكثير.',
    french: "Voyager t'apprend beaucoup de choses.",
    german: 'Reisen lehrt einen viel.',
    spanish: 'Viajar te enseña mucho.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'He enjoys collecting coins.',
    arabic: 'يستمتع بجمع العملات.',
    french: 'Il aime collectionner les pièces.',
    german: 'Er sammelt gerne Münzen.',
    spanish: 'Le gusta coleccionar monedas.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We played chess together.',
    arabic: 'لعبنا الشطرنج معًا.',
    french: 'Nous avons joué aux échecs ensemble.',
    german: 'Wir haben zusammen Schach gespielt.',
    spanish: 'Jugamos ajedrez juntos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We play board games on weekends.',
    arabic: 'نلعب ألعاب الطاولة في عطلة نهاية الأسبوع.',
    french: 'Nous jouons à des jeux de société le week-end.',
    german: 'Wir spielen am Wochenende Brettspiele.',
    spanish: 'Jugamos juegos de mesa los fines de semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I like solving puzzles.',
    arabic: 'أحب حل الألغاز.',
    french: "J'aime résoudre des puzzles.",
    german: 'Ich löse gerne Rätsel.',
    spanish: 'Me gusta resolver rompecabezas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I go to the gym after work.',
    arabic: 'أذهب إلى النادي الرياضي بعد العمل.',
    french: 'Je vais à la salle de sport après le travail.',
    german: 'Ich gehe nach der Arbeit ins Fitnessstudio.',
    spanish: 'Voy al gimnasio después del trabajo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She practices yoga every morning.',
    arabic: 'تمارس اليوغا كل صباح.',
    french: 'Elle pratique le yoga tous les matins.',
    german: 'Sie macht jeden Morgen Yoga.',
    spanish: 'Ella practica yoga cada mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have plans this weekend.',
    arabic: 'لدي خطط هذه العطلة الأسبوعية.',
    french: "J'ai des projets ce week-end.",
    german: 'Ich habe dieses Wochenende Pläne.',
    spanish: 'Tengo planes este fin de semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I like to relax at home.',
    arabic: 'أحب الاسترخاء في المنزل.',
    french: "J'aime me détendre à la maison.",
    german: 'Ich entspanne mich gerne zu Hause.',
    spanish: 'Me gusta relajarme en casa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I joined a football club.',
    arabic: 'انضممت إلى نادي كرة قدم.',
    french: "J'ai rejoint un club de football.",
    german: 'Ich bin einem Fußballverein beigetreten.',
    spanish: 'Me uní a un club de fútbol.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'She plays on the school team.',
    arabic: 'تلعب في فريق المدرسة.',
    french: "Elle joue dans l'équipe de l'école.",
    german: 'Sie spielt im Schulteam.',
    spanish: 'Ella juega en el equipo de la escuela.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He won the competition.',
    arabic: 'فاز بالمسابقة.',
    french: 'Il a gagné la compétition.',
    german: 'Er hat den Wettbewerb gewonnen.',
    spanish: 'Ganó la competencia.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS & STARTERS =====================
  {
    english: 'In my free time, I...',
    arabic: 'في وقت فراغي، أنا...',
    french: 'Pendant mon temps libre, je...',
    german: 'In meiner Freizeit ...',
    spanish: 'En mi tiempo libre, yo...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I enjoy...',
    arabic: 'أستمتع بـ...',
    french: "J'aime...",
    german: 'Ich genieße...',
    spanish: 'Disfruto de...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m interested in...',
    arabic: 'أنا مهتم بـ...',
    french: "Je m'intéresse à...",
    german: 'Ich interessiere mich für...',
    spanish: 'Me interesa...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I spend my weekend...',
    arabic: 'أقضي عطلتي...',
    french: 'Je passe mon week-end...',
    german: 'Ich verbringe mein Wochenende...',
    spanish: 'Paso mi fin de semana...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'What do you do for fun?',
    arabic: 'ماذا تفعل للمتعة؟',
    french: "Qu'est-ce que tu fais pour t'amuser ?",
    german: 'Was machst du zum Spaß?',
    spanish: '¿Qué haces para divertirte?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m not really into...',
    arabic: 'لست مهتمًا حقًا بـ...',
    french: 'Je ne suis pas vraiment fan de...',
    german: 'Ich stehe nicht wirklich auf...',
    spanish: 'No me interesa mucho...',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I’ve been really into... lately',
    arabic: 'أصبحت مهتمًا بـ... مؤخرًا',
    french: 'Je suis vraiment intéressé(e) par ... ces derniers temps',
    german: 'Ich bin in letzter Zeit total auf ...',
    spanish: 'Últimamente me ha interesado mucho...',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I’ve never tried...',
    arabic: 'لم أجرّب... من قبل',
    french: "Je n'ai jamais essayé...",
    german: 'Ich habe ... noch nie ausprobiert',
    spanish: 'Nunca he probado...',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Do you have any hobbies?',
    arabic: 'هل لديك أي هوايات؟',
    french: 'As-tu des passe-temps ?',
    german: 'Hast du Hobbys?',
    spanish: '¿Tienes algún pasatiempo?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m a big fan of...',
    arabic: 'أنا من عشاق...',
    french: 'Je suis un grand fan de...',
    german: 'Ich bin ein großer Fan von...',
    spanish: 'Soy un gran fan de...',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL SUPPORTING EXPRESSIONS =====================
  {
    english: 'playing tennis',
    arabic: 'لعب التنس',
    french: 'jouer au tennis',
    german: 'Tennis spielen',
    spanish: 'jugar al tenis',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈpleɪɪŋ ˈtɛnɪs/',
      french: '/ʒwe o tɛ.nis/',
      german: '/ˈtɛnɪs ˈʃpiːlən/',
      spanish: '/xuˈɣaɾ al ˈtenis/'
    }
  },
  {
    english: 'going to the cinema',
    arabic: 'الذهاب إلى السينما',
    french: 'aller au cinéma',
    german: 'ins Kino gehen',
    spanish: 'ir al cine',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈɡoʊɪŋ tuː ðə ˈsɪnəmə/',
      french: '/a.le o si.ne.ma/',
      german: '/ɪns ˈkiːnoː ˈɡeːən/',
      spanish: '/iɾ al ˈsine/'
    }
  },
  {
    english: 'hanging out with friends',
    arabic: 'قضاء الوقت مع الأصدقاء',
    french: 'passer du temps avec des amis',
    german: 'mit Freunden abhängen',
    spanish: 'pasar el rato con amigos',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ˈhæŋɪŋ aʊt wɪð frɛndz/',
      french: '/pa.se dy tɑ̃ a.vɛk de.z‿a.mi/',
      german: '/mɪt ˈfʁɔɪndn̩ ˈapˌhɛŋən/',
      spanish: '/paˈsaɾ el ˈrato kon aˈmiɣos/'
    }
  },
  {
    english: 'taking photos',
    arabic: 'التقاط الصور',
    french: 'prendre des photos',
    german: 'Fotos machen',
    spanish: 'tomar fotos',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈteɪkɪŋ ˈfoʊtoʊz/',
      french: '/pʁɑ̃dʁ de fɔ.to/',
      german: '/ˈfoːtoːs ˈmaxn̩/',
      spanish: '/toˈmaɾ ˈfotos/'
    }
  }
];
