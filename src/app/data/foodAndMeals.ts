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

export const FOOD_AND_MEALS_DATA: TopicItemRow[] = [
  // ===================== IMAGE 1: VOCABULARY (WORDS & TERMS) =====================
  {
    english: 'breakfast',
    arabic: 'فطور',
    french: 'petit-déjeuner',
    german: 'Frühstück',
    spanish: 'desayuno',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbrɛkfəst/',
      french: '/pə.ti de.ʒœ.ne/',
      german: '/ˈfʁyːˌʃtʏk/',
      spanish: '/desaˈʝuno/'
    }
  },
  {
    english: 'lunch',
    arabic: 'غداء',
    french: 'déjeuner',
    german: 'Mittagessen',
    spanish: 'almuerzo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/lʌntʃ/',
      french: '/de.ʒœ.ne/',
      german: '/ˈmɪtaːkˌʔɛsn̩/',
      spanish: '/alˈmweɾso/'
    }
  },
  {
    english: 'dinner',
    arabic: 'عشاء',
    french: 'dîner',
    german: 'Abendessen',
    spanish: 'cena',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɪnər/',
      french: '/di.ne/',
      german: '/ˈaːbn̩tˌʔɛsn̩/',
      spanish: '/ˈsena/'
    }
  },
  {
    english: 'snack',
    arabic: 'وجبة خفيفة',
    french: 'collation',
    german: 'Snack',
    spanish: 'merienda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/snæk/',
      french: '/kɔ.la.sjɔ̃/',
      german: '/snɛk/',
      spanish: '/meˈɾjenda/'
    }
  },
  {
    english: 'meal',
    arabic: 'وجبة',
    french: 'repas',
    german: 'Mahlzeit',
    spanish: 'comida',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/miːl/',
      french: '/ʁə.pɑ/',
      german: '/ˈmaːlˌtsaɪt/',
      spanish: '/koˈmiða/'
    }
  },
  {
    english: 'hungry',
    arabic: 'جائع',
    french: 'affamé(e)',
    german: 'hungrig',
    spanish: 'hambriento/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈhʌŋɡri/',
      french: '/a.fa.me/',
      german: '/ˈhʊŋʁɪç/',
      spanish: '/amˈbɾjento/'
    }
  },
  {
    english: 'thirsty',
    arabic: 'عطشان',
    french: 'assoiffé(e)',
    german: 'durstig',
    spanish: 'sediento/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈθɜːrsti/',
      french: '/a.swa.fe/',
      german: '/ˈdʊʁstɪç/',
      spanish: '/seˈðjento/'
    }
  },
  {
    english: 'full',
    arabic: 'شبعان',
    french: 'rassasié(e)',
    german: 'satt',
    spanish: 'lleno/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/fʊl/',
      french: '/ʁa.sa.zje/',
      german: '/zat/',
      spanish: '/ˈʝeno/'
    }
  },
  {
    english: 'taste',
    arabic: 'طعم / يتذوق',
    french: 'goût / goûter',
    german: 'Geschmack / probieren',
    spanish: 'sabor / probar',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/teɪst/',
      french: '/ɡu/',
      german: '/ɡəˈʃmak/',
      spanish: '/saˈβoɾ/'
    }
  },
  {
    english: 'delicious',
    arabic: 'لذيذ',
    french: 'délicieux/délicieuse',
    german: 'lecker',
    spanish: 'delicioso/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/dɪˈlɪʃəs/',
      french: '/de.li.sjø/',
      german: '/ˈlɛkɐ/',
      spanish: '/deliˈsjoso/'
    }
  },
  {
    english: 'spicy',
    arabic: 'حار (توابل)',
    french: 'épicé(e)',
    german: 'scharf',
    spanish: 'picante',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈspaɪsi/',
      french: '/e.pi.se/',
      german: '/ʃaʁf/',
      spanish: '/piˈkante/'
    }
  },
  {
    english: 'sour',
    arabic: 'حامض',
    french: 'acide',
    german: 'sauer',
    spanish: 'agrio/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈsaʊər/',
      french: '/a.sid/',
      german: '/ˈzaʊɐ/',
      spanish: '/ˈaɣɾjo/'
    }
  },
  {
    english: 'sweet',
    arabic: 'حلو',
    french: 'sucré(e)',
    german: 'süß',
    spanish: 'dulce',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/swiːt/',
      french: '/sy.kʁe/',
      german: '/zyːs/',
      spanish: '/ˈdulse/'
    }
  },
  {
    english: 'salty',
    arabic: 'مالح',
    french: 'salé(e)',
    german: 'salzig',
    spanish: 'salado/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈsɔːlti/',
      french: '/sa.le/',
      german: '/ˈzaltsɪç/',
      spanish: '/saˈlaðo/'
    }
  },
  {
    english: 'bitter',
    arabic: 'مر',
    french: 'amer/amère',
    german: 'bitter',
    spanish: 'amargo/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈbɪtər/',
      french: '/a.mɛʁ/',
      german: '/ˈbɪtɐ/',
      spanish: '/aˈmaɾɣo/'
    }
  },
  {
    english: 'fresh',
    arabic: 'طازج',
    french: 'frais/fraîche',
    german: 'frisch',
    spanish: 'fresco/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/frɛʃ/',
      french: '/fʁɛ/',
      german: '/fʁɪʃ/',
      spanish: '/ˈfɾesko/'
    }
  },
  {
    english: 'raw',
    arabic: 'نيء',
    french: 'cru(e)',
    german: 'roh',
    spanish: 'crudo/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/rɔː/',
      french: '/kʁy/',
      german: '/ʁoː/',
      spanish: '/ˈkɾuðo/'
    }
  },
  {
    english: 'cooked',
    arabic: 'مطبوخ',
    french: 'cuit(e)',
    german: 'gekocht',
    spanish: 'cocido/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/kʊkt/',
      french: '/kɥi/',
      german: '/ɡəˈkɔxt/',
      spanish: '/koˈsiðo/'
    }
  },
  {
    english: 'fried',
    arabic: 'مقلي',
    french: 'frit(e)',
    german: 'gebraten/frittiert',
    spanish: 'frito/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/fraɪd/',
      french: '/fʁi/',
      german: '/ɡəˈbʁaːtn̩/',
      spanish: '/ˈfɾito/'
    }
  },
  {
    english: 'grilled',
    arabic: 'مشوي',
    french: 'grillé(e)',
    german: 'gegrillt',
    spanish: 'a la parrilla',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ɡrɪld/',
      french: '/ɡʁi.je/',
      german: '/ɡəˈɡʁɪlt/',
      spanish: '/a la paˈriʝa/'
    }
  },
  {
    english: 'boiled',
    arabic: 'مسلوق',
    french: 'bouilli(e)',
    german: 'gekocht',
    spanish: 'hervido/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/bɔɪld/',
      french: '/bu.ji/',
      german: '/ɡəˈkɔxt/',
      spanish: '/eɾˈβiðo/'
    }
  },
  {
    english: 'baked',
    arabic: 'مخبوز',
    french: 'cuit(e) au four',
    german: 'gebacken',
    spanish: 'horneado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/beɪkt/',
      french: '/kɥi o fuʁ/',
      german: '/ɡəˈbakn̩/',
      spanish: '/oɾneˈaðo/'
    }
  },
  {
    english: 'ingredient',
    arabic: 'مكوّن',
    french: 'ingrédient',
    german: 'Zutat',
    spanish: 'ingrediente',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ɪnˈɡriːdiənt/',
      french: '/ɛ̃.ɡʁe.djɑ̃/',
      german: '/ˈtsuːˌtaːt/',
      spanish: '/inɡɾeˈðjente/'
    }
  },
  {
    english: 'recipe',
    arabic: 'وصفة',
    french: 'recette',
    german: 'Rezept',
    spanish: 'receta',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈrɛsəpi/',
      french: '/ʁə.sɛt/',
      german: '/ʁeˈtsɛpt/',
      spanish: '/reˈseta/'
    }
  },
  {
    english: 'restaurant',
    arabic: 'مطعم',
    french: 'restaurant',
    german: 'Restaurant',
    spanish: 'restaurante',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈrɛstrɒnt/',
      french: '/ʁɛs.to.ʁɑ̃/',
      german: '/ʁɛstoˈʁɑ̃/',
      spanish: '/restawˈɾante/'
    }
  },
  {
    english: 'cafe',
    arabic: 'مقهى',
    french: 'café',
    german: 'Café',
    spanish: 'cafetería',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkæfeɪ/',
      french: '/ka.fe/',
      german: '/kaˈfeː/',
      spanish: '/kafeteˈɾi.a/'
    }
  },
  {
    english: 'menu',
    arabic: 'قائمة الطعام',
    french: 'menu / carte',
    german: 'Speisekarte',
    spanish: 'menú/carta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmɛnjuː/',
      french: '/mə.ny/',
      german: '/ˈʃpaɪzəˌkaʁtə/',
      spanish: '/meˈnu/'
    }
  },
  {
    english: 'waiter / waitress',
    arabic: 'نادل / نادلة',
    french: 'serveur/serveuse',
    german: 'Kellner(in)',
    spanish: 'camarero/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈweɪtər / ˈweɪtrɪs/',
      french: '/sɛʁ.vœʁ/',
      german: '/ˈkɛlnɐ/',
      spanish: '/kamaˈɾeɾo/'
    }
  },
  {
    english: 'order',
    arabic: 'طلب',
    french: 'commande / commander',
    german: 'Bestellung / bestellen',
    spanish: 'pedido / pedir',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈɔːrdər/',
      french: '/kɔ.mɑ̃d/',
      german: '/bəˈʃtɛlʊŋ/',
      spanish: '/peˈðiðo/'
    }
  },
  {
    english: 'bill',
    arabic: 'الفاتورة',
    french: 'addition',
    german: 'Rechnung',
    spanish: 'cuenta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/bɪl/',
      french: '/a.di.sjɔ̃/',
      german: '/ˈʁɛçnʊŋ/',
      spanish: '/ˈkwenta/'
    }
  },
  {
    english: 'tip',
    arabic: 'إكرامية',
    french: 'pourboire',
    german: 'Trinkgeld',
    spanish: 'propina',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/tɪp/',
      french: '/puʁ.bwaʁ/',
      german: '/ˈtʁɪŋkˌɡɛlt/',
      spanish: '/pɾoˈpina/'
    }
  },
  {
    english: 'reservation',
    arabic: 'حجز',
    french: 'réservation',
    german: 'Reservierung',
    spanish: 'reserva',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˌrɛzərˈveɪʃən/',
      french: '/ʁe.zɛʁ.va.sjɔ̃/',
      german: '/ʁe.zɛʁˈviː.ʁʊŋ/',
      spanish: '/reˈseɾβa/'
    }
  },
  {
    english: 'takeaway / delivery',
    arabic: 'طلب خارجي / توصيل',
    french: 'à emporter / livraison',
    german: 'Lieferung / zum Mitnehmen',
    spanish: 'para llevar / entrega a domicilio',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈteɪkəweɪ / dɪˈlɪvəri/',
      french: '/a ɑ̃.pɔʁ.te / li.vʁɛ.zɔ̃/',
      german: '/ˈliːfəʁʊŋ/',
      spanish: '/ˈpaɾa ʝeˈβaɾ/'
    }
  },
  {
    english: 'fast food',
    arabic: 'وجبات سريعة',
    french: 'restauration rapide',
    german: 'Fastfood',
    spanish: 'comida rápida',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/fæst fuːd/',
      french: '/ʁɛs.to.ʁa.sjɔ̃ ʁa.pid/',
      german: '/ˈfaːstˌfuːt/',
      spanish: '/koˈmiða ˈrapiða/'
    }
  },
  {
    english: 'vegetables',
    arabic: 'خضروات',
    french: 'légumes',
    german: 'Gemüse',
    spanish: 'verduras',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈvɛdʒtəblz/',
      french: '/le.ɡym/',
      german: '/ɡəˈmyːzə/',
      spanish: '/beɾˈðuɾas/'
    }
  },
  {
    english: 'fruit',
    arabic: 'فاكهة',
    french: 'fruit(s)',
    german: 'Obst',
    spanish: 'fruta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/fruːt/',
      french: '/fʁɥi/',
      german: '/oːpst/',
      spanish: '/ˈfɾuta/'
    }
  },
  {
    english: 'meat',
    arabic: 'لحم',
    french: 'viande',
    german: 'Fleisch',
    spanish: 'carne',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/miːt/',
      french: '/vjɑ̃d/',
      german: '/flaɪʃ/',
      spanish: '/ˈkaɾne/'
    }
  },
  {
    english: 'chicken',
    arabic: 'دجاج',
    french: 'poulet',
    german: 'Hähnchen',
    spanish: 'pollo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtʃɪkɪn/',
      french: '/pu.lɛ/',
      german: '/ˈhɛːnçn̩/',
      spanish: '/ˈpoʝo/'
    }
  },
  {
    english: 'fish',
    arabic: 'سمك',
    french: 'poisson',
    german: 'Fisch',
    spanish: 'pescado',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/fɪʃ/',
      french: '/pwa.sɔ̃/',
      german: '/fɪʃ/',
      spanish: '/pesˈkaðo/'
    }
  },
  {
    english: 'rice',
    arabic: 'أرز',
    french: 'riz',
    german: 'Reis',
    spanish: 'arroz',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/raɪs/',
      french: '/ʁi/',
      german: '/ʁaɪs/',
      spanish: '/aˈros/'
    }
  },
  {
    english: 'bread',
    arabic: 'خبز',
    french: 'pain',
    german: 'Brot',
    spanish: 'pan',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/brɛd/',
      french: '/pɛ̃/',
      german: '/bʁoːt/',
      spanish: '/pan/'
    }
  },
  {
    english: 'pasta',
    arabic: 'معكرونة',
    french: 'pâtes',
    german: 'Nudeln',
    spanish: 'pasta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈpæstə/',
      french: '/pɑt/',
      german: '/ˈnuːdl̩n/',
      spanish: '/ˈpasta/'
    }
  },
  {
    english: 'soup',
    arabic: 'شوربة',
    french: 'soupe',
    german: 'Suppe',
    spanish: 'sopa',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/suːp/',
      french: '/sup/',
      german: '/ˈzʊpə/',
      spanish: '/ˈsopa/'
    }
  },
  {
    english: 'salad',
    arabic: 'سلطة',
    french: 'salade',
    german: 'Salat',
    spanish: 'ensalada',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈsæləd/',
      french: '/sa.lad/',
      german: '/zaˈlaːt/',
      spanish: '/ensaˈlaða/'
    }
  },
  {
    english: 'dessert',
    arabic: 'حلوى / تحلية',
    french: 'dessert',
    german: 'Nachtisch',
    spanish: 'postre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dɪˈzɜːrt/',
      french: '/de.zɛʁ/',
      german: '/ˈnaːxˌtɪʃ/',
      spanish: '/ˈpostɾe/'
    }
  },
  {
    english: 'drink / beverage',
    arabic: 'مشروب',
    french: 'boisson',
    german: 'Getränk',
    spanish: 'bebida',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/drɪŋk / ˈbɛvərɪdʒ/',
      french: '/bwa.sɔ̃/',
      german: '/ɡəˈtʁɛŋk/',
      spanish: '/beˈβiða/'
    }
  },
  {
    english: 'water',
    arabic: 'ماء',
    french: 'eau',
    german: 'Wasser',
    spanish: 'agua',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈwɔːtər/',
      french: '/o/',
      german: '/ˈvasɐ/',
      spanish: '/ˈaɣwa/'
    }
  },
  {
    english: 'juice',
    arabic: 'عصير',
    french: 'jus',
    german: 'Saft',
    spanish: 'jugo/zumo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/dʒuːs/',
      french: '/ʒy/',
      german: '/zaft/',
      spanish: '/ˈxuɣo/'
    }
  },
  {
    english: 'coffee',
    arabic: 'قهوة',
    french: 'café',
    german: 'Kaffee',
    spanish: 'café',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈkɒfi/',
      french: '/ka.fe/',
      german: '/ˈkafe/',
      spanish: '/kaˈfe/'
    }
  },
  {
    english: 'tea',
    arabic: 'شاي',
    french: 'thé',
    german: 'Tee',
    spanish: 'té',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/tiː/',
      french: '/te/',
      german: '/teː/',
      spanish: '/te/'
    }
  },
  {
    english: 'milk',
    arabic: 'حليب',
    french: 'lait',
    german: 'Milch',
    spanish: 'leche',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/mɪlk/',
      french: '/lɛ/',
      german: '/mɪlç/',
      spanish: '/ˈletʃe/'
    }
  },
  {
    english: 'cheese',
    arabic: 'جبن',
    french: 'fromage',
    german: 'Käse',
    spanish: 'queso',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/tʃiːz/',
      french: '/fʁɔ.maʒ/',
      german: '/ˈkɛːzə/',
      spanish: '/ˈkeso/'
    }
  },
  {
    english: 'egg',
    arabic: 'بيضة',
    french: 'œuf',
    german: 'Ei',
    spanish: 'huevo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ɛɡ/',
      french: '/œf/',
      german: '/aɪ/',
      spanish: '/ˈweβo/'
    }
  },
  {
    english: 'cook',
    arabic: 'يطبخ',
    french: 'cuisiner',
    german: 'kochen',
    spanish: 'cocinar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/kʊk/',
      french: '/kɥi.zi.ne/',
      german: '/ˈkɔxn̩/',
      spanish: '/kosiˈnaɾ/'
    }
  },
  {
    english: 'chop',
    arabic: 'يقطع',
    french: 'couper (en morceaux)',
    german: 'schneiden/hacken',
    spanish: 'picar/cortar',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/tʃɒp/',
      french: '/ku.pe/',
      german: '/ˈʃnaɪdn̩/',
      spanish: '/piˈkaɾ/'
    }
  },
  {
    english: 'knife',
    arabic: 'سكين',
    french: 'couteau',
    german: 'Messer',
    spanish: 'cuchillo',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/naɪf/',
      french: '/ku.to/',
      german: '/ˈmɛsɐ/',
      spanish: '/kuˈtʃiʝo/'
    }
  },
  {
    english: 'fork',
    arabic: 'شوكة',
    french: 'fourchette',
    german: 'Gabel',
    spanish: 'tenedor',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/fɔːrk/',
      french: '/fuʁ.ʃɛt/',
      german: '/ˈɡaːbl̩/',
      spanish: '/teneˈðoɾ/'
    }
  },
  {
    english: 'spoon',
    arabic: 'ملعقة',
    french: 'cuillère',
    german: 'Löffel',
    spanish: 'cuchara',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/spuːn/',
      french: '/kɥi.jɛʁ/',
      german: '/ˈlœfl̩/',
      spanish: '/kuˈtʃaɾa/'
    }
  },
  {
    english: 'plate',
    arabic: 'طبق',
    french: 'assiette',
    german: 'Teller',
    spanish: 'plato',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/pleɪt/',
      french: '/a.sjɛt/',
      german: '/ˈtɛlɐ/',
      spanish: '/ˈplato/'
    }
  },
  {
    english: 'cup / glass',
    arabic: 'كوب / كأس',
    french: 'tasse / verre',
    german: 'Tasse / Glas',
    spanish: 'taza / vaso',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kʌp / ɡlæs/',
      french: '/tɑs / vɛʁ/',
      german: '/ˈtasə / ɡlaːs/',
      spanish: '/ˈtasa / ˈβaso/'
    }
  },
  {
    english: 'napkin',
    arabic: 'منديل',
    french: 'serviette',
    german: 'Serviette',
    spanish: 'servilleta',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈnæpkɪn/',
      french: '/sɛʁ.vjɛt/',
      german: '/zɛʁˈvjɛtə/',
      spanish: '/seɾβiˈʝeta/'
    }
  },
  {
    english: 'vegetarian',
    arabic: 'نباتي',
    french: 'végétarien(ne)',
    german: 'Vegetarier(in)',
    spanish: 'vegetariano/a',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˌvɛdʒɪˈtɛəriən/',
      french: '/ve.ʒe.ta.ʁjɛ̃/',
      german: '/veɡeˈtaːʁi̯ɐ/',
      spanish: '/bexetaˈɾjano/'
    }
  },
  {
    english: 'allergy',
    arabic: 'حساسية',
    french: 'allergie',
    german: 'Allergie',
    spanish: 'alergia',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈælərdʒi/',
      french: '/a.lɛʁ.ʒi/',
      german: '/alɛʁˈɡiː/',
      spanish: '/aˈleɾxja/'
    }
  },

  // ===================== IMAGE 2: FULL SENTENCES =====================
  {
    english: 'I never skip breakfast.',
    arabic: 'لا أتخطى الفطور أبدًا.',
    french: 'Je ne saute jamais le petit-déjeuner.',
    german: 'Ich lasse das Frühstück nie aus.',
    spanish: 'Nunca me salto el desayuno.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We have lunch at one o’clock.',
    arabic: 'نتناول الغداء الساعة الواحدة.',
    french: 'Nous déjeunons à une heure.',
    german: 'Wir essen um ein Uhr zu Mittag.',
    spanish: 'Almorzamos a la una.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We eat dinner together.',
    arabic: 'نتناول العشاء معًا.',
    french: 'Nous dînons ensemble.',
    german: 'Wir essen zusammen zu Abend.',
    spanish: 'Cenamos juntos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I had a snack in the afternoon.',
    arabic: 'تناولت وجبة خفيفة بعد الظهر.',
    french: "J'ai pris une collation l'après-midi.",
    german: 'Ich hatte am Nachmittag einen Snack.',
    spanish: 'Comí una merienda por la tarde.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This was a great meal.',
    arabic: 'كانت هذه وجبة رائعة.',
    french: "C'était un excellent repas.",
    german: 'Das war eine tolle Mahlzeit.',
    spanish: 'Esta fue una comida excelente.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m very hungry right now.',
    arabic: 'أنا جائع جدًا الآن.',
    french: "J'ai très faim en ce moment.",
    german: 'Ich habe gerade sehr großen Hunger.',
    spanish: 'Tengo mucha hambre ahora mismo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’m thirsty, can I have some water?',
    arabic: 'أنا عطشان، هل يمكنني الحصول على ماء؟',
    french: "J'ai soif, puis-je avoir de l'eau ?",
    german: 'Ich habe Durst, kann ich etwas Wasser haben?',
    spanish: 'Tengo sed, ¿puedo tomar agua?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'No thanks, I’m full.',
    arabic: 'لا شكرًا، أنا شبعان.',
    french: 'Non merci, je suis rassasié(e).',
    german: 'Nein danke, ich bin satt.',
    spanish: 'No gracias, estoy lleno/a.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This soup has a great taste.',
    arabic: 'لهذه الشوربة طعم رائع.',
    french: 'Cette soupe a un excellent goût.',
    german: 'Diese Suppe schmeckt hervorragend.',
    spanish: 'Esta sopa tiene un sabor excelente.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This soup is delicious.',
    arabic: 'هذه الشوربة لذيذة.',
    french: 'Cette soupe est délicieuse.',
    german: 'Diese Suppe ist lecker.',
    spanish: 'Esta sopa está deliciosa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This dish is too spicy for me.',
    arabic: 'هذا الطبق حار جدًا بالنسبة لي.',
    french: 'Ce plat est trop épicé pour moi.',
    german: 'Dieses Gericht ist mir zu scharf.',
    spanish: 'Este plato es demasiado picante para mí.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Lemons are sour.',
    arabic: 'الليمون حامض.',
    french: 'Les citrons sont acides.',
    german: 'Zitronen sind sauer.',
    spanish: 'Los limones son agrios.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I love sweet desserts.',
    arabic: 'أحب الحلويات.',
    french: "J'adore les desserts sucrés.",
    german: 'Ich liebe süße Nachspeisen.',
    spanish: 'Me encantan los postres dulces.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'This soup is too salty.',
    arabic: 'هذه الشوربة مالحة جدًا.',
    french: 'Cette soupe est trop salée.',
    german: 'Diese Suppe ist zu salzig.',
    spanish: 'Esta sopa está demasiado salada.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Black coffee is bitter.',
    arabic: 'القهوة السوداء مرة.',
    french: 'Le café noir est amer.',
    german: 'Schwarzer Kaffee ist bitter.',
    spanish: 'El café solo es amargo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'These vegetables are very fresh.',
    arabic: 'هذه الخضروات طازجة جدًا.',
    french: 'Ces légumes sont très frais.',
    german: 'Dieses Gemüse ist sehr frisch.',
    spanish: 'Estas verduras están muy frescas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I don’t like raw fish.',
    arabic: 'لا أحب السمك النيء.',
    french: "Je n'aime pas le poisson cru.",
    german: 'Ich mag keinen rohen Fisch.',
    spanish: 'No me gusta el pescado crudo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The chicken is fully cooked.',
    arabic: 'الدجاج مطبوخ جيدًا.',
    french: 'Le poulet est bien cuit.',
    german: 'Das Hähnchen ist durchgegart.',
    spanish: 'El pollo está bien cocido.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I love fried potatoes.',
    arabic: 'أحب البطاطس المقلية.',
    french: "J'adore les pommes de terre frites.",
    german: 'Ich liebe gebratene Kartoffeln.',
    spanish: 'Me encantan las papas fritas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We had grilled fish for dinner.',
    arabic: 'تناولنا سمكًا مشويًا على العشاء.',
    french: 'Nous avons mangé du poisson grillé pour le dîner.',
    german: 'Wir hatten gegrillten Fisch zum Abendessen.',
    spanish: 'Cenamos pescado a la parrilla.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I boiled some eggs.',
    arabic: 'سلقت بعض البيض.',
    french: "J'ai fait bouillir des œufs.",
    german: 'Ich habe ein paar Eier gekocht.',
    spanish: 'Herví unos huevos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'She baked a cake.',
    arabic: 'خبزت كعكة.',
    french: 'Elle a fait cuire un gâteau.',
    german: 'Sie hat einen Kuchen gebacken.',
    spanish: 'Ella horneó un pastel.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Sugar is the main ingredient.',
    arabic: 'السكر هو المكون الرئيسي.',
    french: "Le sucre est l'ingrédient principal.",
    german: 'Zucker ist die Hauptzutat.',
    spanish: 'El azúcar es el ingrediente principal.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I found a new recipe online.',
    arabic: 'وجدت وصفة جديدة على الإنترنت.',
    french: "J'ai trouvé une nouvelle recette en ligne.",
    german: 'Ich habe online ein neues Rezept gefunden.',
    spanish: 'Encontré una nueva receta en línea.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We ate at a nice restaurant.',
    arabic: 'أكلنا في مطعم جميل.',
    french: 'Nous avons mangé dans un bon restaurant.',
    german: 'Wir haben in einem schönen Restaurant gegessen.',
    spanish: 'Comimos en un buen restaurante.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Let’s meet at the cafe.',
    arabic: 'لنلتق في المقهى.',
    french: 'Retrouvons-nous au café.',
    german: 'Lass uns im Café treffen.',
    spanish: 'Quedamos en la cafetería.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I see the menu, please?',
    arabic: 'هل يمكنني رؤية قائمة الطعام من فضلك؟',
    french: "Puis-je voir le menu, s'il vous plaît ?",
    german: 'Kann ich bitte die Speisekarte sehen?',
    spanish: '¿Puedo ver el menú, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The waiter is very friendly.',
    arabic: 'النادل ودود جدًا.',
    french: 'Le serveur est très sympathique.',
    german: 'Der Kellner ist sehr freundlich.',
    spanish: 'El camarero es muy amable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’d like to place an order.',
    arabic: 'أرغب في تقديم طلب.',
    french: 'Je voudrais passer une commande.',
    german: 'Ich möchte eine Bestellung aufgeben.',
    spanish: 'Quisiera hacer un pedido.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can we get the bill?',
    arabic: 'هل يمكننا الحصول على الفاتورة؟',
    french: "Pouvons-nous avoir l'addition ?",
    german: 'Können wir die Rechnung haben?',
    spanish: '¿Nos trae la cuenta?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'We left a small tip.',
    arabic: 'تركنا إكرامية صغيرة.',
    french: 'Nous avons laissé un petit pourboire.',
    german: 'Wir haben ein kleines Trinkgeld gegeben.',
    spanish: 'Dejamos una pequeña propina.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I made a reservation for two.',
    arabic: 'حجزت طاولة لشخصين.',
    french: "J'ai fait une réservation pour deux.",
    german: 'Ich habe für zwei Personen reserviert.',
    spanish: 'Hice una reserva para dos.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We ordered a delivery tonight.',
    arabic: 'طلبنا توصيلاً الليلة.',
    french: 'Nous avons commandé une livraison ce soir.',
    german: 'Wir haben heute Abend eine Lieferung bestellt.',
    spanish: 'Pedimos comida a domicilio esta noche.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I try to avoid fast food.',
    arabic: 'أحاول تجنب الوجبات السريعة.',
    french: "J'essaie d'éviter la restauration rapide.",
    german: 'Ich versuche, Fastfood zu vermeiden.',
    spanish: 'Trato de evitar la comida rápida.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I eat vegetables every day.',
    arabic: 'آكل الخضروات كل يوم.',
    french: 'Je mange des légumes tous les jours.',
    german: 'Ich esse jeden Tag Gemüse.',
    spanish: 'Como verduras todos los días.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Fruit is good for your health.',
    arabic: 'الفاكهة مفيدة لصحتك.',
    french: 'Les fruits sont bons pour la santé.',
    german: 'Obst ist gut für die Gesundheit.',
    spanish: 'La fruta es buena para la salud.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I don’t eat red meat.',
    arabic: 'لا آكل اللحوم الحمراء.',
    french: 'Je ne mange pas de viande rouge.',
    german: 'Ich esse kein rotes Fleisch.',
    spanish: 'No como carne roja.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'We had chicken for dinner.',
    arabic: 'تناولنا الدجاج على العشاء.',
    french: 'Nous avons mangé du poulet pour le dîner.',
    german: 'Wir hatten Hähnchen zum Abendessen.',
    spanish: 'Cenamos pollo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Fish is healthy food.',
    arabic: 'السمك طعام صحي.',
    french: 'Le poisson est un aliment sain.',
    german: 'Fisch ist ein gesundes Lebensmittel.',
    spanish: 'El pescado es un alimento saludable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Rice is a common food in Egypt.',
    arabic: 'الأرز طعام شائع في مصر.',
    french: 'Le riz est un aliment courant en Égypte.',
    german: 'Reis ist ein häufiges Lebensmittel in Ägypten.',
    spanish: 'El arroz es un alimento común en Egipto.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I buy fresh bread every day.',
    arabic: 'أشتري خبزًا طازجًا كل يوم.',
    french: "J'achète du pain frais tous les jours.",
    german: 'Ich kaufe jeden Tag frisches Brot.',
    spanish: 'Compro pan fresco todos los días.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I cooked pasta for dinner.',
    arabic: 'طبخت المعكرونة على العشاء.',
    french: "J'ai cuisiné des pâtes pour le dîner.",
    german: 'Ich habe zum Abendessen Nudeln gekocht.',
    spanish: 'Cociné pasta para la cena.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’ll have a salad, please.',
    arabic: 'سآخذ سلطة من فضلك.',
    french: "Je vais prendre une salade, s'il vous plaît.",
    german: 'Ich nehme einen Salat, bitte.',
    spanish: 'Tomaré una ensalada, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'What’s for dessert?',
    arabic: 'ماذا يوجد للتحلية؟',
    french: "Qu'est-ce qu'il y a comme dessert ?",
    german: 'Was gibt es zum Nachtisch?',
    spanish: '¿Qué hay de postre?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'What would you like to drink?',
    arabic: 'ماذا تريد أن تشرب؟',
    french: 'Que voulez-vous boire ?',
    german: 'Was möchten Sie trinken?',
    spanish: '¿Qué le gustaría beber?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I have some water, please?',
    arabic: 'هل يمكنني الحصول على ماء من فضلك؟',
    french: "Puis-je avoir de l'eau, s'il vous plaît ?",
    german: 'Kann ich bitte etwas Wasser haben?',
    spanish: '¿Puedo tomar agua, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I like fresh orange juice.',
    arabic: 'أحب عصير البرتقال الطازج.',
    french: "J'aime le jus d'orange frais.",
    german: 'Ich mag frischen Orangensaft.',
    spanish: 'Me gusta el jugo de naranja fresco.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I drink coffee every morning.',
    arabic: 'أشرب القهوة كل صباح.',
    french: 'Je bois du café tous les matins.',
    german: 'Ich trinke jeden Morgen Kaffee.',
    spanish: 'Bebo café todas las mañanas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Would you like some tea?',
    arabic: 'هل تريد بعض الشاي؟',
    french: 'Voulez-vous du thé ?',
    german: 'Möchten Sie Tee?',
    spanish: '¿Quieres té?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Children should drink milk.',
    arabic: 'يجب أن يشرب الأطفال الحليب.',
    french: 'Les enfants devraient boire du lait.',
    german: 'Kinder sollten Milch trinken.',
    spanish: 'Los niños deberían tomar leche.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I love cheese sandwiches.',
    arabic: 'أحب سندويشات الجبن.',
    french: "J'adore les sandwichs au fromage.",
    german: 'Ich liebe Käsesandwiches.',
    spanish: 'Me encantan los sándwiches de queso.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I had eggs for breakfast.',
    arabic: 'تناولت البيض على الفطور.',
    french: "J'ai mangé des œufs au petit-déjeuner.",
    german: 'Ich hatte Eier zum Frühstück.',
    spanish: 'Comí huevos en el desayuno.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I like to cook on weekends.',
    arabic: 'أحب الطبخ في عطلة نهاية الأسبوع.',
    french: "J'aime cuisiner le week-end.",
    german: 'Ich koche gerne am Wochenende.',
    spanish: 'Me gusta cocinar los fines de semana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Chop the onions finely.',
    arabic: 'قطّع البصل ناعمًا.',
    french: 'Coupez les oignons finement.',
    german: 'Zwiebeln fein hacken.',
    spanish: 'Corta las cebollas finamente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Be careful with the knife.',
    arabic: 'كن حذرًا مع السكين.',
    french: 'Fais attention avec le couteau.',
    german: 'Sei vorsichtig mit dem Messer.',
    spanish: 'Ten cuidado con el cuchillo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Please pass me a fork.',
    arabic: 'من فضلك ناولني شوكة.',
    french: 'Passe-moi une fourchette, s’il te plaît.',
    german: 'Reich mir bitte eine Gabel.',
    spanish: 'Pásame un tenedor, por favor.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I need a spoon for the soup.',
    arabic: 'أحتاج ملعقة للشوربة.',
    french: "J'ai besoin d'une cuillère pour la soupe.",
    german: 'Ich brauche einen Löffel für die Suppe.',
    spanish: 'Necesito una cuchara para la sopa.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Put the food on the plate.',
    arabic: 'ضع الطعام في الطبق.',
    french: 'Mets la nourriture sur l’assiette.',
    german: 'Leg das Essen auf den Teller.',
    spanish: 'Pon la comida en el plato.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I have a glass of water?',
    arabic: 'هل يمكنني الحصول على كوب ماء؟',
    french: "Puis-je avoir un verre d'eau ?",
    german: 'Kann ich ein Glas Wasser haben?',
    spanish: '¿Puedo tomar un vaso de agua?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I have a napkin, please?',
    arabic: 'هل يمكنني الحصول على منديل من فضلك؟',
    french: "Puis-je avoir une serviette, s'il vous plaît ?",
    german: 'Kann ich bitte eine Serviette haben?',
    spanish: '¿Me puede dar una servilleta, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I’ve been vegetarian for two years.',
    arabic: 'أنا نباتي منذ سنتين.',
    french: 'Je suis végétarien(ne) depuis deux ans.',
    german: 'Ich bin seit zwei Jahren Vegetarier(in).',
    spanish: 'Soy vegetariano/a desde hace dos años.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I have a food allergy.',
    arabic: 'لدي حساسية من الطعام.',
    french: "J'ai une allergie alimentaire.",
    german: 'Ich habe eine Lebensmittelallergie.',
    spanish: 'Tengo una alergia alimentaria.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },

  // ===================== IMAGE 3: CONVERSATIONAL EXPRESSIONS & STARTERS =====================
  {
    english: 'I’d like to order...',
    arabic: 'أريد أن أطلب...',
    french: 'Je voudrais commander...',
    german: 'Ich möchte ... bestellen',
    spanish: 'Quisiera pedir...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Can I have the menu, please?',
    arabic: 'هل يمكنني الحصول على قائمة الطعام؟',
    french: "Puis-je avoir la carte, s'il vous plaît ?",
    german: 'Kann ich bitte die Speisekarte haben?',
    spanish: '¿Puedo ver el menú, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'What do you recommend?',
    arabic: 'بماذا تنصحني؟',
    french: 'Que me recommandez-vous ?',
    german: 'Was empfehlen Sie?',
    spanish: '¿Qué me recomienda?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I’m allergic to...',
    arabic: 'لدي حساسية من...',
    french: 'Je suis allergique à...',
    german: 'Ich bin allergisch gegen...',
    spanish: 'Soy alérgico/a a...',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Can we have the bill, please?',
    arabic: 'هل يمكننا الحصول على الفاتورة؟',
    french: "Pouvons-nous avoir l'addition, s'il vous plaît ?",
    german: 'Können wir bitte die Rechnung haben?',
    spanish: '¿Nos trae la cuenta, por favor?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I don’t like...',
    arabic: 'لا أحب...',
    french: "Je n'aime pas...",
    german: 'Ich mag ... nicht',
    spanish: 'No me gusta...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'My favorite food is...',
    arabic: 'طعامي المفضل هو...',
    french: 'Mon plat préféré est...',
    german: 'Mein Lieblingsessen ist...',
    spanish: 'Mi comida favorita es...',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Is this dish vegetarian?',
    arabic: 'هل هذا الطبق نباتي؟',
    french: 'Ce plat est-il végétarien ?',
    german: 'Ist dieses Gericht vegetarisch?',
    spanish: '¿Este plato es vegetariano?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Table for two, please',
    arabic: 'طاولة لشخصين، من فضلك',
    french: "Une table pour deux, s'il vous plaît",
    german: 'Einen Tisch für zwei, bitte',
    spanish: 'Una mesa para dos, por favor',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Could I get this to go?',
    arabic: 'هل يمكنني الحصول عليه للخارج؟',
    french: "Puis-je l'avoir à emporter ?",
    german: 'Kann ich das zum Mitnehmen bekommen?',
    spanish: '¿Me lo pone para llevar?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'What’s in this dish?',
    arabic: 'ما مكونات هذا الطبق؟',
    french: "Qu'est-ce qu'il y a dans ce plat ?",
    german: 'Was ist in diesem Gericht?',
    spanish: '¿Qué lleva este plato?',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  }
];
