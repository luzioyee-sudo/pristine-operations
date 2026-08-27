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

export const DIRECTIONS_AND_TRANSPORTATION_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY, DIRECTIONS & VEHICLES =====================
  {
    english: 'direction',
    arabic: 'الاتجاه',
    french: 'direction',
    german: 'Richtung',
    spanish: 'dirección',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈrɛkʃən/',
      french: '/di.ʁɛk.sjɔ̃/',
      german: '/ˈʁɪçtʊŋ/',
      spanish: '/diɾekˈsjon/'
    }
  },
  {
    english: 'map',
    arabic: 'الخريطة',
    french: 'carte/plan',
    german: 'Karte',
    spanish: 'mapa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/mæp/',
      french: '/kaʁt/',
      german: '/ˈkaʁtə/',
      spanish: '/ˈmapa/'
    }
  },
  {
    english: 'address',
    arabic: 'العنوان',
    french: 'adresse',
    german: 'Adresse',
    spanish: 'dirección',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/əˈdrɛs/',
      french: '/a.dʁɛs/',
      german: '/aˈdʁɛsə/',
      spanish: '/diɾekˈsjon/'
    }
  },
  {
    english: 'street',
    arabic: 'الشارع',
    french: 'rue',
    german: 'Straße',
    spanish: 'calle',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/striːt/',
      french: '/ʁy/',
      german: '/ˈʃtʁaːsə/',
      spanish: '/ˈkaʎe/'
    }
  },
  {
    english: 'road',
    arabic: 'الطريق',
    french: 'route',
    german: 'Straße/Weg',
    spanish: 'carretera',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/roʊd/',
      french: '/ʁut/',
      german: '/veːk/',
      spanish: '/kareˈteɾa/'
    }
  },
  {
    english: 'corner',
    arabic: 'الزاوية',
    french: 'coin',
    german: 'Ecke',
    spanish: 'esquina',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkɔːrnər/',
      french: '/kwɛ̃/',
      german: '/ˈɛkə/',
      spanish: '/esˈkina/'
    }
  },
  {
    english: 'crossroads / intersection',
    arabic: 'تقاطع الطرق',
    french: 'carrefour',
    german: 'Kreuzung',
    spanish: 'cruce',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkrɔːsroʊdz / ˌɪntərˈsɛkʃən/',
      french: '/kaʁ.fuʁ/',
      german: '/ˈkʁɔɪ̯tsʊŋ/',
      spanish: '/ˈkɾuse/'
    }
  },
  {
    english: 'roundabout',
    arabic: 'دوار',
    french: 'rond-point',
    german: 'Kreisverkehr',
    spanish: 'rotonda',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈraʊndəbaʊt/',
      french: '/ʁɔ̃.pwɛ̃/',
      german: '/ˈkʁaɪs.fɛɐ̯ˌkeːɐ̯/',
      spanish: '/roˈtonda/'
    }
  },
  {
    english: 'traffic light',
    arabic: 'إشارة مرور',
    french: 'feu (de circulation)',
    german: 'Ampel',
    spanish: 'semáforo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtræfɪk laɪt/',
      french: '/fø/',
      german: '/ˈampl̩/',
      spanish: '/seˈmafoɾo/'
    }
  },
  {
    english: 'sign',
    arabic: 'لافتة / إشارة',
    french: 'panneau',
    german: 'Schild',
    spanish: 'señal/letrero',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/saɪn/',
      french: '/pa.no/',
      german: '/ʃɪlt/',
      spanish: '/seˈɲal/'
    }
  },
  {
    english: 'left',
    arabic: 'يسار',
    french: 'gauche',
    german: 'links',
    spanish: 'izquierda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/lɛft/',
      french: '/ɡoʃ/',
      german: '/lɪŋks/',
      spanish: '/iθˈkjeɾða/'
    }
  },
  {
    english: 'right',
    arabic: 'يمين',
    french: 'droite',
    german: 'rechts',
    spanish: 'derecha',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/raɪt/',
      french: '/dʁwat/',
      german: '/ʁɛçts/',
      spanish: '/deˈɾetʃa/'
    }
  },
  {
    english: 'straight ahead',
    arabic: 'مستقيم للأمام',
    french: 'tout droit',
    german: 'geradeaus',
    spanish: 'todo recto',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase',
    phonetic: {
      english: '/streɪt əˈhɛd/',
      french: '/tu dʁwa/',
      german: '/ɡəˈʁaːdəʔaʊs/',
      spanish: '/ˈtoðo ˈrekto/'
    }
  },
  {
    english: 'behind',
    arabic: 'خلف',
    french: 'derrière',
    german: 'hinter',
    spanish: 'detrás',
    type: 'word',
    cefr: 'A1',
    pos: 'preposition',
    phonetic: {
      english: '/bɪˈhaɪnd/',
      french: '/dɛ.ʁjɛʁ/',
      german: '/ˈhɪntɐ/',
      spanish: '/deˈtɾas/'
    }
  },
  {
    english: 'near',
    arabic: 'قريب',
    french: 'proche',
    german: 'nah',
    spanish: 'cerca',
    type: 'word',
    cefr: 'A1',
    pos: 'preposition',
    phonetic: {
      english: '/nɪər/',
      french: '/pʁɔʃ/',
      german: '/naː/',
      spanish: '/ˈseɾka/'
    }
  },
  {
    english: 'far',
    arabic: 'بعيد',
    french: 'loin',
    german: 'weit',
    spanish: 'lejos',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/fɑːr/',
      french: '/lwɛ̃/',
      german: '/vaɪt/',
      spanish: '/ˈlexos/'
    }
  },
  {
    english: 'next to',
    arabic: 'بجانب',
    french: 'à côté de',
    german: 'neben',
    spanish: 'al lado de',
    type: 'chunk',
    cefr: 'A1',
    pos: 'preposition',
    phonetic: {
      english: '/nɛkst tuː/',
      french: '/a ko.te də/',
      german: '/ˈneːbn̩/',
      spanish: '/al ˈlaðo ðe/'
    }
  },
  {
    english: 'opposite',
    arabic: 'مقابل',
    french: 'en face de',
    german: 'gegenüber',
    spanish: 'enfrente de',
    type: 'word',
    cefr: 'A1',
    pos: 'preposition',
    phonetic: {
      english: '/ˈɒpəzɪt/',
      french: '/ɑ̃ fas də/',
      german: '/ɡeːɡn̩ˈʔyːbɐ/',
      spanish: '/emˈfɾente ðe/'
    }
  },
  {
    english: 'between',
    arabic: 'بين',
    french: 'entre',
    german: 'zwischen',
    spanish: 'entre',
    type: 'word',
    cefr: 'A1',
    pos: 'preposition',
    phonetic: {
      english: '/bɪˈtwiːn/',
      french: '/ɑ̃tʁ/',
      german: '/ˈtsvɪʃn̩/',
      spanish: '/ˈentɾe/'
    }
  },
  {
    english: 'north / south / east / west',
    arabic: 'شمال / جنوب / شرق / غرب',
    french: 'nord / sud / est / ouest',
    german: 'Norden / Süden / Osten / Westen',
    spanish: 'norte / sur / este / oeste',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/nɔːrθ saʊθ iːst wɛst/',
      french: '/nɔʁ syd ɛst wɛst/',
      german: '/ˈnɔʁdn̩ ˈzyːdn̩ ˈɔstn̩ ˈvɛstn̩/',
      spanish: '/ˈnoɾte suɾ ˈeste oˈeste/'
    }
  },
  {
    english: 'transportation',
    arabic: 'وسائل النقل',
    french: 'transport',
    german: 'Transport',
    spanish: 'transporte',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˌtrænspɔːrˈteɪʃən/',
      french: '/tʁɑ̃s.pɔʁ/',
      german: '/tʁansˈpɔʁt/',
      spanish: '/tɾansˈpoɾte/'
    }
  },
  {
    english: 'bus',
    arabic: 'حافلة',
    french: 'bus',
    german: 'Bus',
    spanish: 'autobús',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bʌs/',
      french: '/bys/',
      german: '/bʊs/',
      spanish: '/awtoˈβus/'
    }
  },
  {
    english: 'train',
    arabic: 'قطار',
    french: 'train',
    german: 'Zug',
    spanish: 'tren',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/treɪn/',
      french: '/tʁɛ̃/',
      german: '/tsuːk/',
      spanish: '/tɾen/'
    }
  },
  {
    english: 'subway / metro',
    arabic: 'مترو الأنفاق',
    french: 'métro',
    german: 'U-Bahn',
    spanish: 'metro',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsʌbweɪ / ˈmɛtroʊ/',
      french: '/me.tʁo/',
      german: '/ˈuːˌbaːn/',
      spanish: '/ˈmetɾo/'
    }
  },
  {
    english: 'tram',
    arabic: 'ترام',
    french: 'tram',
    german: 'Straßenbahn',
    spanish: 'tranvía',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/træm/',
      french: '/tʁam/',
      german: '/ˈʃtʁaːsn̩ˌbaːn/',
      spanish: '/tɾamˈbi.a/'
    }
  },
  {
    english: 'taxi',
    arabic: 'تاكسي',
    french: 'taxi',
    german: 'Taxi',
    spanish: 'taxi',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtæksi/',
      french: '/tak.si/',
      german: '/ˈtaksi/',
      spanish: '/ˈtaksi/'
    }
  },
  {
    english: 'car',
    arabic: 'سيارة',
    french: 'voiture',
    german: 'Auto',
    spanish: 'coche/carro',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kɑːr/',
      french: '/vwa.tyʁ/',
      german: '/ˈaʊ̯toː/',
      spanish: '/ˈkotʃe/'
    }
  },
  {
    english: 'bicycle',
    arabic: 'دراجة هوائية',
    french: 'vélo',
    german: 'Fahrrad',
    spanish: 'bicicleta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbaɪsɪkl̩/',
      french: '/ve.lo/',
      german: '/ˈfaːɐ̯ˌʁaːt/',
      spanish: '/bisiˈkleta/'
    }
  },
  {
    english: 'motorcycle',
    arabic: 'دراجة نارية',
    french: 'moto',
    german: 'Motorrad',
    spanish: 'motocicleta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmoʊtərˌsaɪkl̩/',
      french: '/mɔ.to/',
      german: '/moˈtoːɐ̯ˌʁaːt/',
      spanish: '/motosiˈkleta/'
    }
  },
  {
    english: 'plane / airplane',
    arabic: 'طائرة',
    french: 'avion',
    german: 'Flugzeug',
    spanish: 'avión',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/pleɪn / ˈɛərpleɪn/',
      french: '/a.vjɔ̃/',
      german: '/ˈfluːkˌtsɔɪ̯k/',
      spanish: '/aˈβjon/'
    }
  },
  {
    english: 'airport',
    arabic: 'مطار',
    french: 'aéroport',
    german: 'Flughafen',
    spanish: 'aeropuerto',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɛərpɔːrt/',
      french: '/a.e.ʁɔ.pɔʁ/',
      german: '/ˈfluːkˌhaːfn̩/',
      spanish: '/aeɾoˈpweɾto/'
    }
  },
  {
    english: 'station',
    arabic: 'محطة',
    french: 'gare/station',
    german: 'Bahnhof/Station',
    spanish: 'estación',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsteɪʃən/',
      french: '/ɡaʁ/',
      german: '/ˈbaːnˌhoːf/',
      spanish: '/estaˈsjon/'
    }
  },
  {
    english: 'stop (bus stop)',
    arabic: 'محطة توقف',
    french: 'arrêt',
    german: 'Haltestelle',
    spanish: 'parada',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/stɒp/',
      french: '/a.ʁɛ/',
      german: '/ˈhaltəˌʃtɛlə/',
      spanish: '/paˈɾaða/'
    }
  },
  {
    english: 'platform',
    arabic: 'الرصيف (محطة القطار)',
    french: 'quai',
    german: 'Bahnsteig',
    spanish: 'andén',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈplætfɔːrm/',
      french: '/kɛ/',
      german: '/ˈbaːnˌʃtaɪk/',
      spanish: '/anˈden/'
    }
  },
  {
    english: 'ticket',
    arabic: 'تذكرة',
    french: 'billet/ticket',
    german: 'Fahrkarte/Ticket',
    spanish: 'boleto/billete',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtɪkɪt/',
      french: '/bi.jɛ/',
      german: '/ˈfaːɐ̯ˌkaʁtə/',
      spanish: '/boˈleto/'
    }
  },
  {
    english: 'fare',
    arabic: 'أجرة الركوب',
    french: 'tarif',
    german: 'Fahrpreis',
    spanish: 'tarifa',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/fɛər/',
      french: '/ta.ʁif/',
      german: '/ˈfaːɐ̯ˌpʁaɪs/',
      spanish: '/taˈɾifa/'
    }
  },
  {
    english: 'driver',
    arabic: 'سائق',
    french: 'conducteur/conductrice',
    german: 'Fahrer(in)',
    spanish: 'conductor/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdraɪvər/',
      french: '/kɔ̃.dyk.tœʁ/',
      german: '/ˈfaːʁɐ/',
      spanish: '/kondukˈtoɾ/'
    }
  },
  {
    english: 'passenger',
    arabic: 'راكب',
    french: 'passager/passagère',
    german: 'Passagier/Fahrgast',
    spanish: 'pasajero/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈpæsəndʒər/',
      french: '/pa.sa.ʒe/',
      german: '/pasaˈʒiːɐ̯/',
      spanish: '/pasaˈxeɾo/'
    }
  },
  {
    english: 'traffic',
    arabic: 'الزحام المروري',
    french: 'circulation',
    german: 'Verkehr',
    spanish: 'tráfico',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtræfɪk/',
      french: '/siʁ.ky.la.sjɔ̃/',
      german: '/fɛɐ̯ˈkeːɐ̯/',
      spanish: '/ˈtɾafiko/'
    }
  },
  {
    english: 'traffic jam',
    arabic: 'اختناق مروري',
    french: 'embouteillage',
    german: 'Stau',
    spanish: 'atasco/embotellamiento',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈtræfɪk dʒæm/',
      french: '/ɑ̃.bu.tɛ.jaʒ/',
      german: '/ʃtaʊ̯/',
      spanish: '/aˈtasko/'
    }
  },
  {
    english: 'rush hour',
    arabic: 'ساعة الذروة',
    french: 'heure de pointe',
    german: 'Stoßzeit',
    spanish: 'hora pico',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/rʌʃ ˈaʊər/',
      french: '/œʁ də pwɛ̃t/',
      german: '/ˈʃtoːsˌtsaɪt/',
      spanish: '/ˈoɾa ˈpiko/'
    }
  },
  {
    english: 'parking',
    arabic: 'موقف سيارات',
    french: 'stationnement/parking',
    german: 'Parkplatz',
    spanish: 'estacionamiento',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈpɑːrkɪŋ/',
      french: '/paʁ.kiŋ/',
      german: '/ˈpaʁkˌplats/',
      spanish: '/estasjonamjenˈto/'
    }
  },
  {
    english: 'driving license',
    arabic: 'رخصة القيادة',
    french: 'permis de conduire',
    german: 'Führerschein',
    spanish: 'licencia de conducir',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈdraɪvɪŋ ˈlaɪsəns/',
      french: '/pɛʁ.mi də kɔ̃.dɥiʁ/',
      german: '/ˈfyːʁɐˌʃaɪn/',
      spanish: '/liˈsensja ðe konduˈsiɾ/'
    }
  },
  {
    english: 'seatbelt',
    arabic: 'حزام الأمان',
    french: 'ceinture de sécurité',
    german: 'Sicherheitsgurt',
    spanish: 'cinturón de seguridad',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsiːtbɛlt/',
      french: '/sɛ̃.tyʁ də se.ky.ʁi.te/',
      german: '/ˈzɪçɐhaɪtsˌɡʊʁt/',
      spanish: '/sintuˈɾon de seɣuɾiˈðað/'
    }
  },
  {
    english: 'walk',
    arabic: 'يمشي',
    french: 'marcher',
    german: 'gehen/laufen',
    spanish: 'caminar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/wɔːk/',
      french: '/maʁ.ʃe/',
      german: '/ˈɡeːən/',
      spanish: '/kamiˈnaɾ/'
    }
  },
  {
    english: 'drive',
    arabic: 'يقود',
    french: 'conduire',
    german: 'fahren',
    spanish: 'conducir/manejar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/draɪv/',
      french: '/kɔ̃.dɥiʁ/',
      german: '/ˈfaːʁən/',
      spanish: '/konduˈsiɾ/'
    }
  },
  {
    english: 'ride',
    arabic: 'يركب',
    french: 'monter (dans un véhicule)',
    german: 'fahren (mitfahren)',
    spanish: 'montar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/raɪd/',
      french: '/mɔ̃.te/',
      german: '/ˈfaːʁən/',
      spanish: '/monˈtaɾ/'
    }
  },
  {
    english: 'arrive',
    arabic: 'يصل',
    french: 'arriver',
    german: 'ankommen',
    spanish: 'llegar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/əˈraɪv/',
      french: '/a.ʁi.ve/',
      german: '/ˈanˌkɔmən/',
      spanish: '/ʝeˈɣaɾ/'
    }
  },
  {
    english: 'depart / leave',
    arabic: 'يغادر',
    french: 'partir',
    german: 'abfahren/abreisen',
    spanish: 'salir/partir',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/dɪˈpɑːrt / liːv/',
      french: '/paʁ.tiʁ/',
      german: '/ˈapˌfaːʁən/',
      spanish: '/saˈliɾ/'
    }
  },
  {
    english: 'journey / trip',
    arabic: 'رحلة',
    french: 'voyage/trajet',
    german: 'Reise/Fahrt',
    spanish: 'viaje/trayecto',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdʒɜːrni / trɪp/',
      french: '/vwa.jaʒ/',
      german: '/ˈʁaɪzə/',
      spanish: '/ˈbjawe/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: 'Can you give me directions?',
    arabic: 'هل يمكنك أن تعطيني الاتجاهات؟',
    french: 'Peux-tu me donner des directions ?',
    german: 'Kannst du mir den Weg beschreiben?',
    spanish: '¿Puedes darme direcciones?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "Let's check the map.",
    arabic: 'لنتحقق من الخريطة.',
    french: 'Regardons la carte.',
    german: 'Lass uns die Karte checken.',
    spanish: 'Revisemos el mapa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "What's your address?",
    arabic: 'ما عنوانك؟',
    french: 'Quelle est ton adresse ?',
    german: 'Wie ist deine Adresse?',
    spanish: '¿Cuál es tu dirección?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I live on a quiet street.',
    arabic: 'أعيش في شارع هادئ.',
    french: "J'habite dans une rue calme.",
    german: 'Ich wohne in einer ruhigen Straße.',
    spanish: 'Vivo en una calle tranquila.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This road is very busy.',
    arabic: 'هذا الطريق مزدحم جدًا.',
    french: 'Cette route est très fréquentée.',
    german: 'Diese Straße ist sehr befahren.',
    spanish: 'Esta carretera está muy transitada.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The shop is on the corner.',
    arabic: 'المتجر في الزاوية.',
    french: 'Le magasin est au coin de la rue.',
    german: 'Der Laden ist an der Ecke.',
    spanish: 'La tienda está en la esquina.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Turn right at the intersection.',
    arabic: 'انعطف يمينًا عند التقاطع.',
    french: 'Tournez à droite au carrefour.',
    german: 'Biegen Sie an der Kreuzung rechts ab.',
    spanish: 'Gire a la derecha en el cruce.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Go around the roundabout.',
    arabic: 'دُر حول الدوار.',
    french: 'Faites le tour du rond-point.',
    german: 'Fahren Sie um den Kreisverkehr.',
    spanish: 'Dé la vuelta a la rotonda.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Turn left at the traffic light.',
    arabic: 'انعطف يسارًا عند إشارة المرور.',
    french: 'Tournez à gauche au feu.',
    german: 'Biegen Sie an der Ampel links ab.',
    spanish: 'Gire a la izquierda en el semáforo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Follow the road sign.',
    arabic: 'اتبع لافتة الطريق.',
    french: 'Suivez le panneau routier.',
    german: 'Folgen Sie dem Straßenschild.',
    spanish: 'Siga la señal de tráfico.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Turn left at the corner.',
    arabic: 'انعطف يسارًا عند الزاوية.',
    french: 'Tournez à gauche au coin.',
    german: 'Biegen Sie an der Ecke links ab.',
    spanish: 'Gire a la izquierda en la esquina.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's on your right.",
    arabic: 'إنه على يمينك.',
    french: "C'est sur ta droite.",
    german: 'Es ist auf deiner rechten Seite.',
    spanish: 'Está a tu derecha.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Go straight ahead.',
    arabic: 'اذهب مستقيمًا.',
    french: 'Allez tout droit.',
    german: 'Gehen Sie geradeaus.',
    spanish: 'Siga todo recto.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The park is behind the building.',
    arabic: 'الحديقة خلف المبنى.',
    french: 'Le parc est derrière le bâtiment.',
    german: 'Der Park ist hinter dem Gebäude.',
    spanish: 'El parque está detrás del edificio.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The station is near my house.',
    arabic: 'المحطة قريبة من منزلي.',
    french: 'La gare est près de chez moi.',
    german: 'Der Bahnhof ist in der Nähe meines Hauses.',
    spanish: 'La estación está cerca de mi casa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Is it far from here?',
    arabic: 'هل هو بعيد من هنا؟',
    french: "Est-ce loin d'ici ?",
    german: 'Ist es weit von hier?',
    spanish: '¿Está lejos de aquí?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The bank is next to the pharmacy.',
    arabic: 'البنك بجانب الصيدلية.',
    french: 'La banque est à côté de la pharmacie.',
    german: 'Die Bank ist neben der Apotheke.',
    spanish: 'El banco está al lado de la farmacia.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The cafe is opposite the school.',
    arabic: 'المقهى مقابل المدرسة.',
    french: "Le café est en face de l'école.",
    german: 'Das Café ist gegenüber der Schule.',
    spanish: 'La cafetería está enfrente de la escuela.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's between the bank and the shop.",
    arabic: 'إنه بين البنك والمتجر.',
    french: "C'est entre la banque et le magasin.",
    german: 'Es liegt zwischen der Bank und dem Geschäft.',
    spanish: 'Está entre el banco y la tienda.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The city is in the north.',
    arabic: 'المدينة في الشمال.',
    french: 'La ville est au nord.',
    german: 'Die Stadt liegt im Norden.',
    spanish: 'La ciudad está en el norte.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Public transportation is cheap here.',
    arabic: 'وسائل النقل العام رخيصة هنا.',
    french: 'Les transports en commun sont bon marché ici.',
    german: 'Öffentliche Verkehrsmittel sind hier günstig.',
    spanish: 'El transporte público es barato aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I take the bus to work.',
    arabic: 'آخذ الحافلة للذهاب إلى العمل.',
    french: 'Je prends le bus pour aller au travail.',
    german: 'Ich fahre mit dem Bus zur Arbeit.',
    spanish: 'Tomo el autobús para ir al trabajo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The train leaves at nine.',
    arabic: 'يغادر القطار الساعة التاسعة.',
    french: 'Le train part à neuf heures.',
    german: 'Der Zug fährt um neun Uhr ab.',
    spanish: 'El tren sale a las nueve.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I take the metro every day.',
    arabic: 'آخذ المترو كل يوم.',
    french: 'Je prends le métro tous les jours.',
    german: 'Ich fahre jeden Tag mit der U-Bahn.',
    spanish: 'Tomo el metro todos los días.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The tram stops here.',
    arabic: 'يتوقف الترام هنا.',
    french: "Le tram s'arrête ici.",
    german: 'Die Straßenbahn hält hier.',
    spanish: 'El tranvía para aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'll take a taxi.",
    arabic: 'سآخذ تاكسي.',
    french: 'Je vais prendre un taxi.',
    german: 'Ich nehme ein Taxi.',
    spanish: 'Tomaré un taxi.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I drive my car to work.',
    arabic: 'أقود سيارتي إلى العمل.',
    french: 'Je conduis ma voiture pour aller au travail.',
    german: 'Ich fahre mit meinem Auto zur Arbeit.',
    spanish: 'Conduzco mi coche al trabajo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I ride my bicycle every morning.',
    arabic: 'أركب دراجتي كل صباح.',
    french: 'Je fais du vélo tous les matins.',
    german: 'Ich fahre jeden Morgen Fahrrad.',
    spanish: 'Monto en bicicleta cada mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He rides a motorcycle.',
    arabic: 'يركب دراجة نارية.',
    french: 'Il conduit une moto.',
    german: 'Er fährt Motorrad.',
    spanish: 'Él monta en motocicleta.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We took a plane to Cairo.',
    arabic: 'ركبنا طائرة إلى القاهرة.',
    french: "Nous avons pris l'avion pour Le Caire.",
    german: 'Wir sind mit dem Flugzeug nach Kairo geflogen.',
    spanish: 'Tomamos un avión a El Cairo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The airport is far from here.',
    arabic: 'المطار بعيد من هنا.',
    french: "L'aéroport est loin d'ici.",
    german: 'Der Flughafen ist weit von hier entfernt.',
    spanish: 'El aeropuerto está lejos de aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The station is nearby.',
    arabic: 'المحطة قريبة.',
    french: 'La gare est proche.',
    german: 'Der Bahnhof ist in der Nähe.',
    spanish: 'La estación está cerca.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Get off at the next stop.',
    arabic: 'انزل عند المحطة القادمة.',
    french: 'Descendez au prochain arrêt.',
    german: 'Steigen Sie an der nächsten Haltestelle aus.',
    spanish: 'Baje en la próxima parada.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The train is on platform two.',
    arabic: 'القطار على الرصيف رقم اثنين.',
    french: 'Le train est sur le quai numéro deux.',
    german: 'Der Zug steht auf Bahnsteig zwei.',
    spanish: 'El tren está en el andén dos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I need to buy a ticket.',
    arabic: 'أحتاج لشراء تذكرة.',
    french: 'Je dois acheter un billet.',
    german: 'Ich muss ein Ticket kaufen.',
    spanish: 'Necesito comprar un boleto.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "What's the bus fare?",
    arabic: 'كم أجرة الحافلة؟',
    french: 'Quel est le tarif du bus ?',
    german: 'Wie hoch ist der Fahrpreis für den Bus?',
    spanish: '¿Cuál es la tarifa del autobús?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The bus driver was friendly.',
    arabic: 'كان سائق الحافلة ودودًا.',
    french: 'Le chauffeur de bus était sympathique.',
    german: 'Der Busfahrer war freundlich.',
    spanish: 'El conductor del autobús fue amable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'There were many passengers on the bus.',
    arabic: 'كان هناك ركاب كثيرون في الحافلة.',
    french: 'Il y avait beaucoup de passagers dans le bus.',
    german: 'Es gab viele Passagiere im Bus.',
    spanish: 'Había muchos pasajeros en el autobús.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "There's a lot of traffic today.",
    arabic: 'هناك زحام مروري كبير اليوم.',
    french: "Il y a beaucoup de circulation aujourd'hui.",
    german: 'Heute ist viel Verkehr.',
    spanish: 'Hay mucho tráfico hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We were stuck in a traffic jam.',
    arabic: 'علقنا في اختناق مروري.',
    french: 'Nous étions coincés dans un embouteillage.',
    german: 'Wir standen im Stau.',
    spanish: 'Estuvimos atrapados en un atasco.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The roads are busy at rush hour.',
    arabic: 'الطرق مزدحمة في ساعة الذروة.',
    french: 'Les routes sont chargées à l’heure de pointe.',
    german: 'Die Straßen sind zur Stoßzeit voll.',
    spanish: 'Las carreteras están congestionadas en hora pico.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "There's no parking here.",
    arabic: 'لا يوجد موقف سيارات هنا.',
    french: "Il n'y a pas de stationnement ici.",
    german: 'Hier gibt es keinen Parkplatz.',
    spanish: 'No hay estacionamiento aquí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I got my driving license last year.',
    arabic: 'حصلت على رخصة القيادة العام الماضي.',
    french: "J'ai obtenu mon permis de conduire l'année dernière.",
    german: 'Ich habe letztes Jahr meinen Führerschein gemacht.',
    spanish: 'Obtuve mi licencia de conducir el año pasado.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Please wear your seatbelt.',
    arabic: 'من فضلك ارتدِ حزام الأمان.',
    french: 'Veuillez mettre votre ceinture de sécurité.',
    german: 'Bitte legen Sie Ihren Sicherheitsgurt an.',
    spanish: 'Por favor, póngase el cinturón de seguridad.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I walk to work every day.',
    arabic: 'أمشي إلى العمل كل يوم.',
    french: "Je marche jusqu'au travail tous les jours.",
    german: 'Ich gehe jeden Tag zu Fuß zur Arbeit.',
    spanish: 'Camino al trabajo todos los días.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I drive to the office.',
    arabic: 'أقود سيارتي إلى المكتب.',
    french: "Je conduis jusqu'au bureau.",
    german: 'Ich fahre ins Büro.',
    spanish: 'Conduzco a la oficina.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I ride the bus to school.',
    arabic: 'أركب الحافلة إلى المدرسة.',
    french: 'Je prends le bus pour aller à l’école.',
    german: 'Ich fahre mit dem Bus zur Schule.',
    spanish: 'Voy en autobús a la escuela.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The train will arrive soon.',
    arabic: 'سيصل القطار قريبًا.',
    french: 'Le train va bientôt arriver.',
    german: 'Der Zug wird bald ankommen.',
    spanish: 'El tren llegará pronto.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The flight departs at noon.',
    arabic: 'تغادر الرحلة عند الظهر.',
    french: 'Le vol part à midi.',
    german: 'Der Flug fliegt um Mittag ab.',
    spanish: 'El vuelo sale al mediodía.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We had a long journey.',
    arabic: 'كانت لدينا رحلة طويلة.',
    french: 'Nous avons eu un long voyage.',
    german: 'Wir hatten eine lange Reise.',
    spanish: 'Tuvimos un viaje largo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS & ASKING FOR DIRECTIONS =====================
  {
    english: 'Excuse me, where is...?',
    arabic: 'عفوًا، أين يوجد...؟',
    french: 'Excusez-moi, où est... ?',
    german: 'Entschuldigung, wo ist...?',
    spanish: 'Disculpe, ¿dónde está...?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Turn left / right',
    arabic: 'انعطف يسارًا / يمينًا',
    french: 'Tournez à gauche / à droite',
    german: 'Biegen Sie links/rechts ab',
    spanish: 'Gire a la izquierda / derecha',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Go straight ahead',
    arabic: 'اذهب مستقيمًا',
    french: 'Allez tout droit',
    german: 'Gehen Sie geradeaus',
    spanish: 'Siga todo recto',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'How do I get to...?',
    arabic: 'كيف أصل إلى...؟',
    french: 'Comment puis-je aller à... ?',
    german: 'Wie komme ich zu...?',
    spanish: '¿Cómo llego a...?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Take the bus number...',
    arabic: 'اركب الحافلة رقم...',
    french: 'Prenez le bus numéro...',
    german: 'Nehmen Sie den Bus Nummer...',
    spanish: 'Tome el autobús número...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'How much is a ticket?',
    arabic: 'كم سعر التذكرة؟',
    french: 'Combien coûte un billet ?',
    german: 'Wie viel kostet ein Ticket?',
    spanish: '¿Cuánto cuesta un boleto?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "It's a five-minute walk",
    arabic: 'المسافة خمس دقائق سيرًا على الأقدام',
    french: "C'est à cinq minutes à pied",
    german: 'Es sind fünf Minuten zu Fuß',
    spanish: 'Está a cinco minutos caminando',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Which platform does the train leave from?',
    arabic: 'من أي رصيف يغادر القطار؟',
    french: 'De quel quai part le train ?',
    german: 'Von welchem Bahnsteig fährt der Zug ab?',
    spanish: '¿De qué andén sale el tren?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Could you drop me off here?',
    arabic: 'هل يمكنك إنزالي هنا؟',
    french: 'Pouvez-vous me déposer ici ?',
    german: 'Können Sie mich hier absetzen?',
    spanish: '¿Me puede dejar aquí?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL NAVIGATION & TRANSIT UNITS =====================
  {
    english: 'pedestrian crossing / crosswalk',
    arabic: 'ممر مشاة',
    french: 'passage piéton',
    german: 'Fußgängerüberweg / Zebrastreifen',
    spanish: 'paso de peatones',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/pəˈdɛstriən ˈkrɔːsɪŋ/',
      french: '/pa.saʒ pje.tɔ̃/',
      german: '/ˈtseːbʁaˌʃtʁaɪfn̩/',
      spanish: '/ˈpaso ðe peaˈtones/'
    }
  },
  {
    english: 'highway / motorway',
    arabic: 'طريق سريع',
    french: 'autoroute',
    german: 'Autobahn',
    spanish: 'autopista',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈhaɪweɪ/',
      french: '/o.to.ʁut/',
      german: '/ˈaʊ̯toːˌbaːn/',
      spanish: '/awtoˈpista/'
    }
  },
  {
    english: 'on foot',
    arabic: 'سيرًا على الأقدام',
    french: 'à pied',
    german: 'zu Fuß',
    spanish: 'a pie',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase',
    phonetic: {
      english: '/ɒn fʊt/',
      french: '/a pje/',
      german: '/tsuː fuːs/',
      spanish: '/a pje/'
    }
  },
  {
    english: 'miss the bus',
    arabic: 'يفوت الحافلة',
    french: 'rater le bus',
    german: 'den Bus verpassen',
    spanish: 'perder el autobús',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/mɪs ðə bʌs/',
      french: '/ʁa.te lə bys/',
      german: '/deːn bʊs fɛɐ̯ˈpasn̩/',
      spanish: '/peɾˈðeɾ el awtoˈβus/'
    }
  },
  {
    english: 'catch the train',
    arabic: 'يلحق بالقطار',
    french: 'attraper le train',
    german: 'den Zug erwischen',
    spanish: 'alcanzar el tren',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/kætʃ ðə treɪn/',
      french: '/a.tʁa.pe lə tʁɛ̃/',
      german: '/deːn tsuːk ɛɐ̯ˈvɪʃn̩/',
      spanish: '/alkanˈsaɾ el tɾen/'
    }
  },
  {
    english: 'delay',
    arabic: 'تأخير',
    french: 'retard',
    german: 'Verspätung',
    spanish: 'retraso',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈleɪ/',
      french: '/ʁə.taʁ/',
      german: '/fɛɐ̯ˈʃpɛːtʊŋ/',
      spanish: '/reˈtɾaso/'
    }
  },
  {
    english: 'timetable / schedule',
    arabic: 'جدول المواعيد',
    french: 'horaire',
    german: 'Fahrplan',
    spanish: 'horario',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈtaɪmˌteɪbl̩/',
      french: '/ɔ.ʁɛʁ/',
      german: '/ˈfaːɐ̯ˌplaːn/',
      spanish: '/oˈɾaɾjo/'
    }
  },
  {
    english: 'get on / board',
    arabic: 'يركب (حافلة / قطار)',
    french: 'monter à bord',
    german: 'einsteigen',
    spanish: 'subir / abordar',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ɡɛt ɒn/',
      french: '/mɔ̃.te a bɔʁ/',
      german: '/ˈaɪnˌʃtaɪɡn̩/',
      spanish: '/suˈβiɾ/'
    }
  },
  {
    english: 'get off',
    arabic: 'ينزل (من وسيلة نقل)',
    french: 'descendre',
    german: 'aussteigen',
    spanish: 'bajarse',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ɡɛt ɒf/',
      french: '/de.sɑ̃dʁ/',
      german: '/ˈaʊ̯sˌʃtaɪɡn̩/',
      spanish: '/baˈxaɾse/'
    }
  }
];
