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

export const HOME_AND_WHERE_YOU_LIVE_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY & HOUSING TERMINOLOGY =====================
  {
    english: 'home',
    arabic: 'المنزل',
    french: 'maison/chez-soi',
    german: 'Zuhause',
    spanish: 'hogar',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/hoʊm/',
      french: '/mɛ.zɔ̃/',
      german: '/tsuˈhaʊ̯zə/',
      spanish: '/oˈɣaɾ/'
    }
  },
  {
    english: 'house',
    arabic: 'منزل',
    french: 'maison',
    german: 'Haus',
    spanish: 'casa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/haʊs/',
      french: '/mɛ.zɔ̃/',
      german: '/haʊ̯s/',
      spanish: '/ˈkasa/'
    }
  },
  {
    english: 'apartment / flat',
    arabic: 'شقة',
    french: 'appartement',
    german: 'Wohnung',
    spanish: 'apartamento/piso',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/əˈpɑːrtmənt / flæt/',
      french: '/a.paʁ.tə.mɑ̃/',
      german: '/ˈvoːnʊŋ/',
      spanish: '/apaɾtaˈmento/'
    }
  },
  {
    english: 'building',
    arabic: 'مبنى',
    french: 'immeuble/bâtiment',
    german: 'Gebäude',
    spanish: 'edificio',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbɪldɪŋ/',
      french: '/i.mœbl/',
      german: '/ɡəˈbɔɪ̯də/',
      spanish: '/eðiˈfisjo/'
    }
  },
  {
    english: 'floor',
    arabic: 'الطابق',
    french: 'étage',
    german: 'Stockwerk/Etage',
    spanish: 'piso',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/flɔːr/',
      french: '/e.taʒ/',
      german: '/ˈʃtɔkvɛʁk/',
      spanish: '/ˈpiso/'
    }
  },
  {
    english: 'room',
    arabic: 'غرفة',
    french: 'pièce',
    german: 'Zimmer',
    spanish: 'habitación',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ruːm/',
      french: '/pjɛs/',
      german: '/ˈtsɪmɐ/',
      spanish: '/aβitaˈsjon/'
    }
  },
  {
    english: 'bedroom',
    arabic: 'غرفة نوم',
    french: 'chambre',
    german: 'Schlafzimmer',
    spanish: 'dormitorio',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbɛdruːm/',
      french: '/ʃɑ̃bʁ/',
      german: '/ˈʃlaːfˌtsɪmɐ/',
      spanish: '/doɾmiˈtoɾjo/'
    }
  },
  {
    english: 'living room',
    arabic: 'غرفة المعيشة',
    french: 'salon',
    german: 'Wohnzimmer',
    spanish: 'sala de estar',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈlɪvɪŋ ruːm/',
      french: '/sa.lɔ̃/',
      german: '/ˈvoːnˌtsɪmɐ/',
      spanish: '/ˈsala ðe esˈtaɾ/'
    }
  },
  {
    english: 'kitchen',
    arabic: 'مطبخ',
    french: 'cuisine',
    german: 'Küche',
    spanish: 'cocina',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkɪtʃɪn/',
      french: '/kɥi.zin/',
      german: '/ˈkʏçə/',
      spanish: '/koˈsina/'
    }
  },
  {
    english: 'bathroom',
    arabic: 'حمام',
    french: 'salle de bains',
    german: 'Badezimmer',
    spanish: 'baño',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbɑːθruːm/',
      french: '/sal də bɛ̃/',
      german: '/ˈbaːdəˌtsɪmɐ/',
      spanish: '/ˈbaɲo/'
    }
  },
  {
    english: 'dining room',
    arabic: 'غرفة الطعام',
    french: 'salle à manger',
    german: 'Esszimmer',
    spanish: 'comedor',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdaɪnɪŋ ruːm/',
      french: '/sal a mɑ̃.ʒe/',
      german: '/ˈɛsˌtsɪmɐ/',
      spanish: '/komeˈðoɾ/'
    }
  },
  {
    english: 'balcony',
    arabic: 'شرفة',
    french: 'balcon',
    german: 'Balkon',
    spanish: 'balcón',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbælkəni/',
      french: '/bal.kɔ̃/',
      german: '/balˈkɔŋ/',
      spanish: '/balˈkon/'
    }
  },
  {
    english: 'garden / yard',
    arabic: 'حديقة',
    french: 'jardin',
    german: 'Garten',
    spanish: 'jardín',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡɑːrdn̩ / jɑːrd/',
      french: '/ʒaʁ.dɛ̃/',
      german: '/ˈɡaʁtn̩/',
      spanish: '/xaɾˈðin/'
    }
  },
  {
    english: 'garage',
    arabic: 'جراج',
    french: 'garage',
    german: 'Garage',
    spanish: 'garaje',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɡærɑːʒ/',
      french: '/ɡa.ʁaʒ/',
      german: '/ɡaˈʁaːʒə/',
      spanish: '/ɡaˈɾaxe/'
    }
  },
  {
    english: 'roof',
    arabic: 'السقف',
    french: 'toit',
    german: 'Dach',
    spanish: 'techo/tejado',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ruːf/',
      french: '/twa/',
      german: '/dax/',
      spanish: '/ˈtetʃo/'
    }
  },
  {
    english: 'door',
    arabic: 'باب',
    french: 'porte',
    german: 'Tür',
    spanish: 'puerta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dɔːr/',
      french: '/pɔʁt/',
      german: '/tyːɐ̯/',
      spanish: '/ˈpweɾta/'
    }
  },
  {
    english: 'window',
    arabic: 'نافذة',
    french: 'fenêtre',
    german: 'Fenster',
    spanish: 'ventana',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɪndoʊ/',
      french: '/fə.nɛtʁ/',
      german: '/ˈfɛnstɐ/',
      spanish: '/benˈtana/'
    }
  },
  {
    english: 'wall',
    arabic: 'حائط',
    french: 'mur',
    german: 'Wand',
    spanish: 'pared',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/wɔːl/',
      french: '/myʁ/',
      german: '/vant/',
      spanish: '/paˈɾeð/'
    }
  },
  {
    english: 'stairs',
    arabic: 'سلّم',
    french: 'escalier',
    german: 'Treppe',
    spanish: 'escaleras',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/stɛərz/',
      french: '/ɛs.ka.lje/',
      german: '/ˈtʁɛpə/',
      spanish: '/eskaˈleɾas/'
    }
  },
  {
    english: 'elevator / lift',
    arabic: 'مصعد',
    french: 'ascenseur',
    german: 'Aufzug',
    spanish: 'ascensor',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɛləveɪtər / lɪft/',
      french: '/a.sɑ̃.sœʁ/',
      german: '/ˈaʊ̯fˌtsuːk/',
      spanish: '/asenˈsoɾ/'
    }
  },
  {
    english: 'furniture',
    arabic: 'أثاث',
    french: 'meubles',
    german: 'Möbel',
    spanish: 'muebles',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɜːrnɪtʃər/',
      french: '/mœbl/',
      german: '/ˈmøːbl̩/',
      spanish: '/ˈmweβles/'
    }
  },
  {
    english: 'table',
    arabic: 'طاولة',
    french: 'table',
    german: 'Tisch',
    spanish: 'mesa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈteɪbl̩/',
      french: '/tabl/',
      german: '/tɪʃ/',
      spanish: '/ˈmesa/'
    }
  },
  {
    english: 'chair',
    arabic: 'كرسي',
    french: 'chaise',
    german: 'Stuhl',
    spanish: 'silla',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/tʃɛər/',
      french: '/ʃɛz/',
      german: '/ʃtuːl/',
      spanish: '/ˈsiʎa/'
    }
  },
  {
    english: 'sofa / couch',
    arabic: 'أريكة',
    french: 'canapé',
    german: 'Sofa',
    spanish: 'sofá',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsoʊfə / kaʊtʃ/',
      french: '/ka.na.pe/',
      german: '/ˈzoːfa/',
      spanish: '/soˈfa/'
    }
  },
  {
    english: 'bed',
    arabic: 'سرير',
    french: 'lit',
    german: 'Bett',
    spanish: 'cama',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bɛd/',
      french: '/li/',
      german: '/bɛt/',
      spanish: '/ˈkama/'
    }
  },
  {
    english: 'wardrobe / closet',
    arabic: 'خزانة ملابس',
    french: 'armoire',
    german: 'Kleiderschrank',
    spanish: 'armario',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɔːrdroʊb / ˈklɒzɪt/',
      french: '/aʁ.mwaʁ/',
      german: '/ˈklaɪ̯dɐˌʃʁaŋk/',
      spanish: '/aɾˈmaɾjo/'
    }
  },
  {
    english: 'shelf',
    arabic: 'رف',
    french: 'étagère',
    german: 'Regal',
    spanish: 'estante',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ʃɛlf/',
      french: '/e.ta.ʒɛʁ/',
      german: '/ʁeˈɡaːl/',
      spanish: '/esˈtante/'
    }
  },
  {
    english: 'lamp',
    arabic: 'مصباح',
    french: 'lampe',
    german: 'Lampe',
    spanish: 'lámpara',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/læmp/',
      french: '/lɑ̃p/',
      german: '/ˈlampə/',
      spanish: '/ˈlampaɾa/'
    }
  },
  {
    english: 'fridge / refrigerator',
    arabic: 'ثلاجة',
    french: 'réfrigérateur',
    german: 'Kühlschrank',
    spanish: 'refrigerador/nevera',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/frɪdʒ / rɪˈfrɪdʒəreɪtər/',
      french: '/ʁe.fʁi.ʒe.ʁa.tœʁ/',
      german: '/ˈkyːlˌʃʁaŋk/',
      spanish: '/neˈβeɾa/'
    }
  },
  {
    english: 'oven',
    arabic: 'فرن',
    french: 'four',
    german: 'Ofen',
    spanish: 'horno',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈʌvən/',
      french: '/fuʁ/',
      german: '/ˈoːfn̩/',
      spanish: '/ˈoɾno/'
    }
  },
  {
    english: 'sink',
    arabic: 'حوض',
    french: 'évier',
    german: 'Spüle/Waschbecken',
    spanish: 'fregadero',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/sɪŋk/',
      french: '/e.vje/',
      german: '/ˈʃpyːlə/',
      spanish: '/fɾeɣaˈðeɾo/'
    }
  },
  {
    english: 'curtain',
    arabic: 'ستارة',
    french: 'rideau',
    german: 'Vorhang',
    spanish: 'cortina',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkɜːrtn̩/',
      french: '/ʁi.do/',
      german: '/ˈfoːɐ̯ˌhaŋ/',
      spanish: '/koɾˈtina/'
    }
  },
  {
    english: 'carpet / rug',
    arabic: 'سجادة',
    french: 'tapis',
    german: 'Teppich',
    spanish: 'alfombra',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkɑːrpɪt / rʌɡ/',
      french: '/ta.pi/',
      german: '/ˈtɛpɪç/',
      spanish: '/alˈfombɾa/'
    }
  },
  {
    english: 'rent',
    arabic: 'الإيجار',
    french: 'loyer',
    german: 'Miete',
    spanish: 'alquiler',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/rɛnt/',
      french: '/lwa.je/',
      german: '/ˈmiːtə/',
      spanish: '/alKiˈleɾ/'
    }
  },
  {
    english: 'own',
    arabic: 'يمتلك',
    french: 'posséder',
    german: 'besitzen',
    spanish: 'poseer',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/oʊn/',
      french: '/pɔ.se.de/',
      german: '/bəˈzɪtsn̩/',
      spanish: '/poseˈeɾ/'
    }
  },
  {
    english: 'landlord',
    arabic: 'صاحب العقار',
    french: 'propriétaire',
    german: 'Vermieter(in)',
    spanish: 'propietario/casero',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈlændlɔːrd/',
      french: '/pʁɔ.pʁi.je.tɛʁ/',
      german: '/fɛɐ̯ˈmiːtɐ/',
      spanish: '/pɾopjeˈtaɾjo/'
    }
  },
  {
    english: 'tenant',
    arabic: 'المستأجر',
    french: 'locataire',
    german: 'Mieter(in)',
    spanish: 'inquilino/a',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈtɛnənt/',
      french: '/lɔ.ka.tɛʁ/',
      german: '/ˈmiːtɐ/',
      spanish: '/iŋkiˈlino/'
    }
  },
  {
    english: 'neighbor',
    arabic: 'جار',
    french: 'voisin(e)',
    german: 'Nachbar(in)',
    spanish: 'vecino/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈneɪbər/',
      french: '/vwa.zɛ̃/',
      german: '/ˈnaxbaːɐ̯/',
      spanish: '/beˈsino/'
    }
  },
  {
    english: 'neighborhood',
    arabic: 'الحي',
    french: 'quartier',
    german: 'Nachbarschaft/Viertel',
    spanish: 'vecindario/barrio',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈneɪbərhʊd/',
      french: '/kaʁ.tje/',
      german: '/ˈnaxbaːɐ̯ˌʃaft/',
      spanish: '/besinˈdaɾjo/'
    }
  },
  {
    english: 'move (house)',
    arabic: 'ينتقل (للسكن)',
    french: 'déménager',
    german: 'umziehen',
    spanish: 'mudarse',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/muːv/',
      french: '/de.me.na.ʒe/',
      german: '/ˈʊmˌtsiːən/',
      spanish: '/muˈðaɾse/'
    }
  },
  {
    english: 'decorate',
    arabic: 'يزيّن / يزخرف',
    french: 'décorer',
    german: 'dekorieren',
    spanish: 'decorar',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ˈdɛkəreɪt/',
      french: '/de.kɔ.ʁe/',
      german: '/dekoˈʁiːʁən/',
      spanish: '/dekoˈɾaɾ/'
    }
  },
  {
    english: 'clean',
    arabic: 'ينظّف / نظيف',
    french: 'nettoyer/propre',
    german: 'putzen/sauber',
    spanish: 'limpiar/limpio',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/kliːn/',
      french: '/nɛ.twa.je/',
      german: '/ˈpʊtsn̩/',
      spanish: '/limˈpjaɾ/'
    }
  },
  {
    english: 'tidy / messy',
    arabic: 'مرتب / فوضوي',
    french: 'rangé(e) / en désordre',
    german: 'ordentlich / unordentlich',
    spanish: 'ordenado/a / desordenado/a',
    type: 'chunk',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈtaɪdi / ˈmɛsi/',
      french: '/ʁɑ̃.ʒe / ɑ̃ de.zɔʁdʁ/',
      german: '/ˈɔʁdntlɪç/',
      spanish: '/oɾðeˈnaðo/'
    }
  },
  {
    english: 'spacious',
    arabic: 'واسع',
    french: 'spacieux/spacieuse',
    german: 'geräumig',
    spanish: 'espacioso/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈspeɪʃəs/',
      french: '/spa.sjø/',
      german: '/ɡəˈʁɔɪ̯mɪç/',
      spanish: '/espaˈsjosx/'
    }
  },
  {
    english: 'cozy',
    arabic: 'دافئ ومريح',
    french: 'douillet(te)/confortable',
    german: 'gemütlich',
    spanish: 'acogedor/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈkoʊzi/',
      french: '/du.jɛ/',
      german: '/ɡəˈmyːtlɪç/',
      spanish: '/akoxeˈðoɾ/'
    }
  },
  {
    english: 'quiet / noisy',
    arabic: 'هادئ / صاخب',
    french: 'calme / bruyant(e)',
    german: 'ruhig / laut',
    spanish: 'tranquilo/a / ruidoso/a',
    type: 'chunk',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈkwaɪət / ˈnɔɪzi/',
      french: '/kalm / bʁɥi.jɑ̃/',
      german: '/ˈʁuːɪç / laʊ̯t/',
      spanish: '/tɾaŋˈkilo/'
    }
  },
  {
    english: 'view',
    arabic: 'إطلالة',
    french: 'vue',
    german: 'Aussicht',
    spanish: 'vista',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/vjuː/',
      french: '/vy/',
      german: '/ˈaʊ̯sˌzɪçt/',
      spanish: '/ˈbista/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: "There's no place like home.",
    arabic: 'لا يوجد مكان مثل المنزل.',
    french: "Il n'y a pas d'endroit comme chez soi.",
    german: 'Zuhause ist es am schönsten.',
    spanish: 'No hay lugar como el hogar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My house has a garden.',
    arabic: 'منزلي له حديقة.',
    french: 'Ma maison a un jardin.',
    german: 'Mein Haus hat einen Garten.',
    spanish: 'Mi casa tiene un jardín.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I live in a small apartment.',
    arabic: 'أعيش في شقة صغيرة.',
    french: "J'habite dans un petit appartement.",
    german: 'Ich wohne in einer kleinen Wohnung.',
    spanish: 'Vivo en un apartamento pequeño.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We live in a tall building.',
    arabic: 'نعيش في مبنى عالٍ.',
    french: 'Nous habitons dans un immeuble haut.',
    german: 'Wir wohnen in einem hohen Gebäude.',
    spanish: 'Vivimos en un edificio alto.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I live on the third floor.',
    arabic: 'أعيش في الطابق الثالث.',
    french: "J'habite au troisième étage.",
    german: 'Ich wohne im dritten Stock.',
    spanish: 'Vivo en el tercer piso.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This room is very bright.',
    arabic: 'هذه الغرفة مضيئة جدًا.',
    french: 'Cette pièce est très lumineuse.',
    german: 'Dieses Zimmer ist sehr hell.',
    spanish: 'Esta habitación es muy luminosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have my own bedroom.',
    arabic: 'لدي غرفة نوم خاصة بي.',
    french: "J'ai ma propre chambre.",
    german: 'Ich habe mein eigenes Schlafzimmer.',
    spanish: 'Tengo mi propia habitación.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We watch TV in the living room.',
    arabic: 'نشاهد التلفاز في غرفة المعيشة.',
    french: 'Nous regardons la télé dans le salon.',
    german: 'Wir sehen im Wohnzimmer fern.',
    spanish: 'Vemos la televisión en la sala de estar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The kitchen is next to the living room.',
    arabic: 'المطبخ بجانب غرفة المعيشة.',
    french: 'La cuisine est à côté du salon.',
    german: 'Die Küche ist neben dem Wohnzimmer.',
    spanish: 'La cocina está al lado de la sala de estar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The bathroom is upstairs.',
    arabic: 'الحمام في الطابق العلوي.',
    french: 'La salle de bains est à l’étage.',
    german: 'Das Badezimmer ist oben.',
    spanish: 'El baño está arriba.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We eat in the dining room.',
    arabic: 'نأكل في غرفة الطعام.',
    french: 'Nous mangeons dans la salle à manger.',
    german: 'Wir essen im Esszimmer.',
    spanish: 'Comemos en el comedor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I like sitting on the balcony.',
    arabic: 'أحب الجلوس في الشرفة.',
    french: "J'aime m'asseoir sur le balcon.",
    german: 'Ich sitze gerne auf dem Balkon.',
    spanish: 'Me gusta sentarme en el balcón.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We have a small garden.',
    arabic: 'لدينا حديقة صغيرة.',
    french: 'Nous avons un petit jardin.',
    german: 'Wir haben einen kleinen Garten.',
    spanish: 'Tenemos un jardín pequeño.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The car is in the garage.',
    arabic: 'السيارة في الجراج.',
    french: 'La voiture est dans le garage.',
    german: 'Das Auto steht in der Garage.',
    spanish: 'El coche está en el garaje.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "There's a nice view from the roof.",
    arabic: 'هناك إطلالة جميلة من السطح.',
    french: 'Il y a une belle vue depuis le toit.',
    german: 'Vom Dach aus hat man eine schöne Aussicht.',
    spanish: 'Hay una vista bonita desde el techo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Please close the door.',
    arabic: 'من فضلك أغلق الباب.',
    french: "Ferme la porte, s'il te plaît.",
    german: 'Bitte schließ die Tür.',
    spanish: 'Por favor, cierra la puerta.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Open the window, please.',
    arabic: 'افتح النافذة من فضلك.',
    french: "Ouvre la fenêtre, s'il te plaît.",
    german: 'Öffne bitte das Fenster.',
    spanish: 'Abre la ventana, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We painted the wall blue.',
    arabic: 'طلينا الحائط باللون الأزرق.',
    french: 'Nous avons peint le mur en bleu.',
    german: 'Wir haben die Wand blau gestrichen.',
    spanish: 'Pintamos la pared de azul.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I climbed the stairs quickly.',
    arabic: 'صعدت السلم بسرعة.',
    french: "J'ai monté l'escalier rapidement.",
    german: 'Ich bin schnell die Treppe hochgestiegen.',
    spanish: 'Subí las escaleras rápidamente.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We took the elevator.',
    arabic: 'أخذنا المصعد.',
    french: "Nous avons pris l'ascenseur.",
    german: 'Wir haben den Aufzug genommen.',
    spanish: 'Tomamos el ascensor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We need new furniture.',
    arabic: 'نحتاج إلى أثاث جديد.',
    french: 'Nous avons besoin de nouveaux meubles.',
    german: 'Wir brauchen neue Möbel.',
    spanish: 'Necesitamos muebles nuevos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Put the plates on the table.',
    arabic: 'ضع الأطباق على الطاولة.',
    french: 'Mets les assiettes sur la table.',
    german: 'Stell die Teller auf den Tisch.',
    spanish: 'Pon los platos en la mesa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Please sit on this chair.',
    arabic: 'من فضلك اجلس على هذا الكرسي.',
    french: "Assieds-toi sur cette chaise, s'il te plaît.",
    german: 'Bitte setz dich auf diesen Stuhl.',
    spanish: 'Siéntate en esta silla, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We sat on the sofa.',
    arabic: 'جلسنا على الأريكة.',
    french: 'Nous nous sommes assis sur le canapé.',
    german: 'Wir haben auf dem Sofa gesessen.',
    spanish: 'Nos sentamos en el sofá.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I make my bed every morning.',
    arabic: 'أرتب سريري كل صباح.',
    french: 'Je fais mon lit tous les matins.',
    german: 'Ich mache jeden Morgen mein Bett.',
    spanish: 'Hago mi cama cada mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I put my clothes in the wardrobe.',
    arabic: 'أضع ملابسي في خزانة الملابس.',
    french: "Je mets mes vêtements dans l'armoire.",
    german: 'Ich lege meine Kleidung in den Kleiderschrank.',
    spanish: 'Pongo mi ropa en el armario.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The books are on the shelf.',
    arabic: 'الكتب على الرف.',
    french: "Les livres sont sur l'étagère.",
    german: 'Die Bücher sind im Regal.',
    spanish: 'Los libros están en el estante.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Turn on the lamp, please.',
    arabic: 'أشعل المصباح من فضلك.',
    french: "Allume la lampe, s'il te plaît.",
    german: 'Mach bitte die Lampe an.',
    spanish: 'Enciende la lámpara, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Put the milk in the fridge.',
    arabic: 'ضع الحليب في الثلاجة.',
    french: 'Mets le lait dans le réfrigérateur.',
    german: 'Stell die Milch in den Kühlschrank.',
    spanish: 'Pon la leche en el refrigerador.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She baked the cake in the oven.',
    arabic: 'خبزت الكعكة في الفرن.',
    french: 'Elle a fait cuire le gâteau au four.',
    german: 'Sie hat den Kuchen im Ofen gebacken.',
    spanish: 'Horneó el pastel en el horno.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Wash your hands in the sink.',
    arabic: 'اغسل يديك في الحوض.',
    french: 'Lave-toi les mains dans l’évier.',
    german: 'Wasch dir die Hände am Waschbecken.',
    spanish: 'Lávate las manos en el fregadero.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Close the curtains, please.',
    arabic: 'أغلق الستائر من فضلك.',
    french: "Ferme les rideaux, s'il te plaît.",
    german: 'Zieh bitte die Vorhänge zu.',
    spanish: 'Cierra las cortinas, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The carpet is very soft.',
    arabic: 'السجادة ناعمة جدًا.',
    french: 'Le tapis est très doux.',
    german: 'Der Teppich ist sehr weich.',
    spanish: 'La alfombra es muy suave.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The rent is affordable.',
    arabic: 'الإيجار معقول.',
    french: 'Le loyer est abordable.',
    german: 'Die Miete ist erschwinglich.',
    spanish: 'El alquiler es asequible.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We own this house.',
    arabic: 'نحن نمتلك هذا المنزل.',
    french: 'Nous possédons cette maison.',
    german: 'Wir besitzen dieses Haus.',
    spanish: 'Somos dueños de esta casa.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I need to call the landlord.',
    arabic: 'أحتاج للاتصال بصاحب العقار.',
    french: 'Je dois appeler le propriétaire.',
    german: 'Ich muss den Vermieter anrufen.',
    spanish: 'Necesito llamar al propietario.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The tenant pays rent monthly.',
    arabic: 'يدفع المستأجر الإيجار شهريًا.',
    french: 'Le locataire paie le loyer chaque mois.',
    german: 'Der Mieter zahlt monatlich Miete.',
    spanish: 'El inquilino paga el alquiler mensualmente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My neighbor is very friendly.',
    arabic: 'جاري ودود جدًا.',
    french: 'Mon voisin est très amical.',
    german: 'Mein Nachbar ist sehr freundlich.',
    spanish: 'Mi vecino es muy amable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's a quiet neighborhood.",
    arabic: 'إنه حي هادئ.',
    french: "C'est un quartier calme.",
    german: 'Es ist eine ruhige Nachbarschaft.',
    spanish: 'Es un vecindario tranquilo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We moved to a new house.',
    arabic: 'انتقلنا إلى منزل جديد.',
    french: 'Nous avons déménagé dans une nouvelle maison.',
    german: 'Wir sind in ein neues Haus gezogen.',
    spanish: 'Nos mudamos a una casa nueva.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We decorated the living room.',
    arabic: 'زيّنا غرفة المعيشة.',
    french: 'Nous avons décoré le salon.',
    german: 'Wir haben das Wohnzimmer dekoriert.',
    spanish: 'Decoramos la sala de estar.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I clean my room every week.',
    arabic: 'أنظف غرفتي كل أسبوع.',
    french: 'Je nettoie ma chambre chaque semaine.',
    german: 'Ich putze mein Zimmer jede Woche.',
    spanish: 'Limpio mi habitación cada semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My room is always tidy.',
    arabic: 'غرفتي دائمًا مرتبة.',
    french: 'Ma chambre est toujours rangée.',
    german: 'Mein Zimmer ist immer ordentlich.',
    spanish: 'Mi habitación siempre está ordenada.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This apartment is very spacious.',
    arabic: 'هذه الشقة واسعة جدًا.',
    french: 'Cet appartement est très spacieux.',
    german: 'Diese Wohnung ist sehr geräumig.',
    spanish: 'Este apartamento es muy espacioso.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Their home is small but cozy.',
    arabic: 'منزلهم صغير لكنه دافئ ومريح.',
    french: 'Leur maison est petite mais confortable.',
    german: 'Ihr Zuhause ist klein, aber gemütlich.',
    spanish: 'Su hogar es pequeño pero acogedor.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'This street is very quiet.',
    arabic: 'هذا الشارع هادئ جدًا.',
    french: 'Cette rue est très calme.',
    german: 'Diese Straße ist sehr ruhig.',
    spanish: 'Esta calle es muy tranquila.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We have a beautiful view.',
    arabic: 'لدينا إطلالة جميلة.',
    french: 'Nous avons une belle vue.',
    german: 'Wir haben eine schöne Aussicht.',
    spanish: 'Tenemos una vista hermosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS =====================
  {
    english: 'I live in an apartment',
    arabic: 'أعيش في شقة',
    french: "J'habite dans un appartement",
    german: 'Ich wohne in einer Wohnung',
    spanish: 'Vivo en un apartamento',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My house has three bedrooms',
    arabic: 'منزلي به ثلاث غرف نوم',
    french: 'Ma maison a trois chambres',
    german: 'Mein Haus hat drei Schlafzimmer',
    spanish: 'Mi casa tiene tres dormitorios',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I live on the second floor',
    arabic: 'أعيش في الطابق الثاني',
    french: "J'habite au deuxième étage",
    german: 'Ich wohne im zweiten Stock',
    spanish: 'Vivo en el segundo piso',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I've lived here for...",
    arabic: 'أعيش هنا منذ...',
    french: "J'habite ici depuis...",
    german: 'Ich wohne seit ... hier',
    spanish: 'Vivo aquí desde hace...',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "It's close to...",
    arabic: 'إنه قريب من...',
    french: "C'est près de...",
    german: 'Es ist nahe an...',
    spanish: 'Está cerca de...',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's a bit far from...",
    arabic: 'إنه بعيد قليلاً عن...',
    french: "C'est un peu loin de...",
    german: 'Es ist etwas weit von...',
    spanish: 'Está un poco lejos de...',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "We're thinking of moving",
    arabic: 'نفكر في الانتقال للسكن',
    french: 'Nous pensons déménager',
    german: 'Wir denken darüber nach umzuziehen',
    spanish: 'Estamos pensando en mudarnos',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The rent is ... per month',
    arabic: 'الإيجار ... شهريًا',
    french: 'Le loyer est de ... par mois',
    german: 'Die Miete beträgt ... pro Monat',
    spanish: 'El alquiler es de ... al mes',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'My favorite room is...',
    arabic: 'غرفتي المفضلة هي...',
    french: 'Ma pièce préférée est...',
    german: 'Mein Lieblingszimmer ist...',
    spanish: 'Mi habitación favorita es...',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL HOUSEHOLD & DOMESTIC UNITS =====================
  {
    english: 'mirror',
    arabic: 'مرآة',
    french: 'miroir',
    german: 'Spiegel',
    spanish: 'espejo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmɪrər/',
      french: '/mi.ʁwaʁ/',
      german: '/ˈʃpiːɡl̩/',
      spanish: '/esˈpexo/'
    }
  },
  {
    english: 'doorbell',
    arabic: 'جرس الباب',
    french: 'sonnette',
    german: 'Türklingel',
    spanish: 'timbre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɔːrbɛl/',
      french: '/sɔ.nɛt/',
      german: '/ˈtyːɐ̯ˌklɪŋl̩/',
      spanish: '/ˈtimbɾe/'
    }
  },
  {
    english: 'air conditioning',
    arabic: 'تكييف الهواء',
    french: 'climatisation',
    german: 'Klimaanlage',
    spanish: 'aire acondicionado',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ɛər kənˈdɪʃənɪŋ/',
      french: '/kli.ma.ti.za.sjɔ̃/',
      german: '/ˈkliːmaʔanˌlaːɡə/',
      spanish: '/ˈaiɾe akondiθjoˈnaðo/'
    }
  },
  {
    english: 'heating',
    arabic: 'المدفأة / التدفئة',
    french: 'chauffage',
    german: 'Heizung',
    spanish: 'calefacción',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈhiːtɪŋ/',
      french: '/ʃo.faʒ/',
      german: '/ˈhaɪ̯tsʊŋ/',
      spanish: '/kalefakˈsjon/'
    }
  },
  {
    english: 'roommate / flatmate',
    arabic: 'شريك السكن / الغرفة',
    french: 'colocataire',
    german: 'Mitbewohner(in)',
    spanish: 'compañero/a de piso',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈruːmmeɪt/',
      french: '/kɔ.lɔ.ka.tɛʁ/',
      german: '/ˈmɪtbəˌvoːnɐ/',
      spanish: '/kompaˈɲeɾo/'
    }
  },
  {
    english: 'rent an apartment',
    arabic: 'يستأجر شقة',
    french: 'louer un appartement',
    german: 'eine Wohnung mieten',
    spanish: 'alquilar un apartamento',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/rɛnt ən əˈpɑːrtmənt/',
      french: '/lwe œ̃n a.paʁ.tə.mɑ̃/',
      german: '/ˈmiːtn̩/',
      spanish: '/alkiˈlaɾ un apaɾtaˈmento/'
    }
  },
  {
    english: 'downstairs',
    arabic: 'في الطابق السفلي',
    french: 'en bas',
    german: 'unten',
    spanish: 'abajo',
    type: 'word',
    cefr: 'A1',
    pos: 'adverb',
    phonetic: {
      english: '/ˌdaʊnˈstɛərz/',
      french: '/ɑ̃ ba/',
      german: '/ˈʊntn̩/',
      spanish: '/aˈβaxo/'
    }
  },
  {
    english: 'upstairs',
    arabic: 'في الطابق العلوي',
    french: 'en haut',
    german: 'oben',
    spanish: 'arriba',
    type: 'word',
    cefr: 'A1',
    pos: 'adverb',
    phonetic: {
      english: '/ˌʌpˈstɛərz/',
      french: '/ɑ̃ o/',
      german: '/ˈoːbn̩/',
      spanish: '/aˈriβa/'
    }
  }
];
