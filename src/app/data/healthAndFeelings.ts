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

export const HEALTH_AND_FEELINGS_DATA: TopicItemRow[] = [
  // ===================== IMAGE 3: VOCABULARY & MEDICAL / EMOTIONAL TERMS =====================
  {
    english: 'health',
    arabic: 'الصحة',
    french: 'santé',
    german: 'Gesundheit',
    spanish: 'salud',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/hɛlθ/',
      french: '/sɑ̃.te/',
      german: '/ɡəˈzʊntˌhaɪ̯t/',
      spanish: '/saˈluð/'
    }
  },
  {
    english: 'healthy',
    arabic: 'صحي / بصحة جيدة',
    french: 'en bonne santé/sain(e)',
    german: 'gesund',
    spanish: 'saludable',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈhɛlθi/',
      french: '/sɛ̃/',
      german: '/ɡəˈzʊnt/',
      spanish: '/saluˈdaβle/'
    }
  },
  {
    english: 'unhealthy',
    arabic: 'غير صحي',
    french: 'malsain(e)',
    german: 'ungesund',
    spanish: 'poco saludable',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ʌnˈhɛlθi/',
      french: '/mal.sɛ̃/',
      german: '/ˈʊnɡəˌzʊnt/',
      spanish: '/ˈpoko saluˈdaβle/'
    }
  },
  {
    english: 'sick / ill',
    arabic: 'مريض',
    french: 'malade',
    german: 'krank',
    spanish: 'enfermo/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/sɪk / ɪl/',
      french: '/ma.lad/',
      german: '/kʁaŋk/',
      spanish: '/emˈfeɾmo/'
    }
  },
  {
    english: 'symptom',
    arabic: 'عرض (مرضي)',
    french: 'symptôme',
    german: 'Symptom',
    spanish: 'síntoma',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɪmptəm/',
      french: '/sɛ̃p.toːm/',
      german: '/zʏmpˈtoːm/',
      spanish: '/ˈsintoma/'
    }
  },
  {
    english: 'pain / ache',
    arabic: 'ألم',
    french: 'douleur',
    german: 'Schmerz',
    spanish: 'dolor',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/peɪn / eɪk/',
      french: '/du.lœʁ/',
      german: '/ʃmɛʁts/',
      spanish: '/doˈloɾ/'
    }
  },
  {
    english: 'headache',
    arabic: 'صداع',
    french: 'mal de tête',
    german: 'Kopfschmerzen',
    spanish: 'dolor de cabeza',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈhɛdeɪk/',
      french: '/mal də tɛt/',
      german: '/ˈkɔpfˌʃmɛʁtsn̩/',
      spanish: '/doˈloɾ ðe kaˈβeθa/'
    }
  },
  {
    english: 'stomachache',
    arabic: 'ألم في المعدة',
    french: 'mal de ventre',
    german: 'Bauchschmerzen',
    spanish: 'dolor de estómago',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈstʌməkeɪk/',
      french: '/mal də vɑ̃tʁ/',
      german: '/ˈbaʊ̯xˌʃmɛʁtsn̩/',
      spanish: '/doˈloɾ ðe esˈtomaɣo/'
    }
  },
  {
    english: 'toothache',
    arabic: 'ألم في الأسنان',
    french: 'mal de dents',
    german: 'Zahnschmerzen',
    spanish: 'dolor de muelas',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈtuːθeɪk/',
      french: '/mal də dɑ̃/',
      german: '/ˈtsaːnˌʃmɛʁtsn̩/',
      spanish: '/doˈloɾ ðe ˈmwelas/'
    }
  },
  {
    english: 'backache',
    arabic: 'ألم في الظهر',
    french: 'mal de dos',
    german: 'Rückenschmerzen',
    spanish: 'dolor de espalda',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈbækeɪk/',
      french: '/mal də do/',
      german: '/ˈʁʏkn̩ˌʃmɛʁtsn̩/',
      spanish: '/doˈloɾ ðe esˈpalda/'
    }
  },
  {
    english: 'fever',
    arabic: 'حمى',
    french: 'fièvre',
    german: 'Fieber',
    spanish: 'fiebre',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈfiːvər/',
      french: '/fjɛvʁ/',
      german: '/ˈfiːbɐ/',
      spanish: '/ˈfjeβɾe/'
    }
  },
  {
    english: 'cold (illness)',
    arabic: 'نزلة برد',
    french: 'rhume',
    german: 'Erkältung',
    spanish: 'resfriado',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/koʊld/',
      french: '/ʁym/',
      german: '/ɛɐ̯ˈkɛltʊŋ/',
      spanish: '/resˈfɾjaðo/'
    }
  },
  {
    english: 'flu',
    arabic: 'إنفلونزا',
    french: 'grippe',
    german: 'Grippe',
    spanish: 'gripe',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/fluː/',
      french: '/ɡʁip/',
      german: '/ˈɡʁɪpə/',
      spanish: '/ˈɡɾipe/'
    }
  },
  {
    english: 'cough',
    arabic: 'سعال / يسعل',
    french: 'toux/tousser',
    german: 'Husten/husten',
    spanish: 'tos/toser',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kɒf/',
      french: '/tu/',
      german: '/ˈhuːstn̩/',
      spanish: '/tos/'
    }
  },
  {
    english: 'sneeze',
    arabic: 'يعطس',
    french: 'éternuer',
    german: 'niesen',
    spanish: 'estornudar',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/sniːz/',
      french: '/e.tɛʁ.nɥe/',
      german: '/ˈniːzn̩/',
      spanish: '/estoɾnuˈðaɾ/'
    }
  },
  {
    english: 'sore throat',
    arabic: 'التهاب الحلق',
    french: 'mal de gorge',
    german: 'Halsschmerzen',
    spanish: 'dolor de garganta',
    type: 'chunk',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/sɔːr θroʊt/',
      french: '/mal də ɡɔʁʒ/',
      german: '/ˈhalsˌʃmɛʁtsn̩/',
      spanish: '/doˈloɾ ðe ɣaɾˈɣanta/'
    }
  },
  {
    english: 'injury',
    arabic: 'إصابة',
    french: 'blessure',
    german: 'Verletzung',
    spanish: 'lesión',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɪndʒəri/',
      french: '/blɛ.syʁ/',
      german: '/fɛɐ̯ˈlɛtsʊŋ/',
      spanish: '/leˈsjon/'
    }
  },
  {
    english: 'cut',
    arabic: 'جرح (سطحي)',
    french: 'coupure',
    german: 'Schnittwunde',
    spanish: 'corte',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/kʌt/',
      french: '/ku.pyʁ/',
      german: '/ˈʃnɪtˌvʊndə/',
      spanish: '/ˈkoɾte/'
    }
  },
  {
    english: 'bruise',
    arabic: 'كدمة',
    french: 'bleu/ecchymose',
    german: 'blauer Fleck',
    spanish: 'moretón',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/bruːz/',
      french: '/blø/',
      german: '/ˈblaʊ̯ɐ flɛk/',
      spanish: '/moɾeˈton/'
    }
  },
  {
    english: 'broken bone / fracture',
    arabic: 'كسر في العظم',
    french: 'fracture',
    german: 'Knochenbruch',
    spanish: 'fractura',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbroʊkən boʊn / ˈfræktʃər/',
      french: '/fʁak.tyʁ/',
      german: '/ˈknɔxn̩ˌbʁʊx/',
      spanish: '/fɾakˈtuɾa/'
    }
  },
  {
    english: 'medicine',
    arabic: 'دواء',
    french: 'médicament',
    german: 'Medikament',
    spanish: 'medicina',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈmɛdsɪn/',
      french: '/me.di.ka.mɑ̃/',
      german: '/medikaˈmɛnt/',
      spanish: '/meðiˈsina/'
    }
  },
  {
    english: 'pill / tablet',
    arabic: 'حبة دواء',
    french: 'comprimé',
    german: 'Tablette',
    spanish: 'pastilla',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/pɪl / ˈtæblɪt/',
      french: '/kɔ̃.pʁi.me/',
      german: '/taˈblɛtə/',
      spanish: '/pasˈtiʎa/'
    }
  },
  {
    english: 'prescription',
    arabic: 'وصفة طبية',
    french: 'ordonnance',
    german: 'Rezept',
    spanish: 'receta médica',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/prɪˈskrɪpʃən/',
      french: '/ɔʁ.dɔ.nɑ̃s/',
      german: '/ʁeˈtsɛpt/',
      spanish: '/reˈseta ˈmeðika/'
    }
  },
  {
    english: 'pharmacy',
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
    english: 'doctor',
    arabic: 'طبيب',
    french: 'médecin',
    german: 'Arzt/Ärztin',
    spanish: 'médico/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɒktər/',
      french: '/med.sɛ̃/',
      german: '/aːɐ̯tst/',
      spanish: '/ˈmeðiko/'
    }
  },
  {
    english: 'nurse',
    arabic: 'ممرضة',
    french: 'infirmier/infirmière',
    german: 'Krankenpfleger/-schwester',
    spanish: 'enfermero/a',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/nɜːrs/',
      french: '/ɛ̃.fiʁ.mje/',
      german: '/ˈkʁaŋkn̩ˌpfleːɡɐ/',
      spanish: '/emfeɾˈmeɾo/'
    }
  },
  {
    english: 'hospital',
    arabic: 'مستشفى',
    french: 'hôpital',
    german: 'Krankenhaus',
    spanish: 'hospital',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈhɒspɪtl̩/',
      french: '/o.pi.tal/',
      german: '/ˈkʁaŋkn̩ˌhaʊ̯s/',
      spanish: '/ospiˈtal/'
    }
  },
  {
    english: 'clinic',
    arabic: 'عيادة',
    french: 'clinique',
    german: 'Klinik',
    spanish: 'clínica',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈklɪnɪk/',
      french: '/kli.nik/',
      german: '/ˈkliːnɪk/',
      spanish: '/ˈklinika/'
    }
  },
  {
    english: 'appointment',
    arabic: 'موعد',
    french: 'rendez-vous',
    german: 'Termin',
    spanish: 'cita',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/əˈpɔɪntmənt/',
      french: '/ʁɑ̃.de.vu/',
      german: '/tɛʁˈmiːn/',
      spanish: '/ˈsita/'
    }
  },
  {
    english: 'checkup',
    arabic: 'فحص طبي دوري',
    french: 'bilan de santé',
    german: 'Untersuchung/Check-up',
    spanish: 'chequeo',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈtʃɛkʌp/',
      french: '/bi.lɑ̃ də sɑ̃.te/',
      german: '/ˈʊntɐˌzuːxʊŋ/',
      spanish: '/tʃeˈkeo/'
    }
  },
  {
    english: 'treatment',
    arabic: 'العلاج',
    french: 'traitement',
    german: 'Behandlung',
    spanish: 'tratamiento',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈtriːtmənt/',
      french: '/tʁɛt.mɑ̃/',
      german: '/bəˈhandlʊŋ/',
      spanish: '/tɾataˈmjento/'
    }
  },
  {
    english: 'surgery',
    arabic: 'عملية جراحية',
    french: 'opération/chirurgie',
    german: 'Operation',
    spanish: 'cirugía',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈsɜːrdʒəri/',
      french: '/ɔ.pe.ʁa.sjɔ̃/',
      german: '/opəʁaˈtsi̯oːn/',
      spanish: '/siɾuˈxi.a/'
    }
  },
  {
    english: 'recover',
    arabic: 'يتعافى',
    french: 'se rétablir',
    german: 'sich erholen',
    spanish: 'recuperarse',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/rɪˈkʌvər/',
      french: '/sə ʁe.ta.bliʁ/',
      german: '/zɪç ɛɐ̯ˈhoːlən/',
      spanish: '/rekupeˈɾaɾse/'
    }
  },
  {
    english: 'rest',
    arabic: 'يرتاح / راحة',
    french: 'se reposer/repos',
    german: 'sich ausruhen/Ruhe',
    spanish: 'descansar/descanso',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/rɛst/',
      french: '/sə ʁə.po.ze/',
      german: '/zɪç ˈaʊ̯sˌʁuːən/',
      spanish: '/deskanˈsaɾ/'
    }
  },
  {
    english: 'exercise',
    arabic: 'يمارس الرياضة',
    french: "faire de l'exercice",
    german: 'Sport treiben',
    spanish: 'hacer ejercicio',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/ˈɛksərsaɪz/',
      french: '/fɛʁ də l‿ɛɡ.zɛʁ.sis/',
      german: '/ʃpɔʁt ˈtʁaɪ̯bn̩/',
      spanish: '/aˈseɾ exeɾˈsisjo/'
    }
  },
  {
    english: 'diet',
    arabic: 'نظام غذائي',
    french: 'régime alimentaire',
    german: 'Diät/Ernährung',
    spanish: 'dieta',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdaɪət/',
      french: '/ʁe.ʒim/',
      german: '/diˈɛːt/',
      spanish: '/ˈdjeta/'
    }
  },
  {
    english: 'sleep',
    arabic: 'ينام / النوم',
    french: 'dormir/sommeil',
    german: 'schlafen/Schlaf',
    spanish: 'dormir/sueño',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/sliːp/',
      french: '/dɔʁ.miʁ/',
      german: '/ˈʃlaːfn̩/',
      spanish: '/doɾˈmiɾ/'
    }
  },
  {
    english: 'stress',
    arabic: 'توتر',
    french: 'stress',
    german: 'Stress',
    spanish: 'estrés',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/strɛs/',
      french: '/stʁɛs/',
      german: '/ʃtʁɛs/',
      spanish: '/esˈtɾes/'
    }
  },
  {
    english: 'tired / exhausted',
    arabic: 'متعب / منهك',
    french: 'fatigué(e)/épuisé(e)',
    german: 'müde/erschöpft',
    spanish: 'cansado/a / agotado/a',
    type: 'chunk',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈtaɪərd / ɪɡˈzɔːstɪd/',
      french: '/fa.ti.ɡe / e.pɥi.ze/',
      german: '/ˈmyːdə / ɛɐ̯ˈʃœpft/',
      spanish: '/kanˈsaðo / aɣoˈtaðo/'
    }
  },
  {
    english: 'energetic',
    arabic: 'نشيط',
    french: 'énergique',
    german: 'energiegeladen',
    spanish: 'enérgico/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˌɛnərˈdʒɛtɪk/',
      french: '/e.nɛʁ.ʒik/',
      german: '/enɛʁˈɡiːɡəˌlaːdn̩/',
      spanish: '/eˈneɾxiko/'
    }
  },
  {
    english: 'feel well / feel bad',
    arabic: 'يشعر بحالة جيدة/سيئة',
    french: 'se sentir bien / se sentir mal',
    german: 'sich gut/schlecht fühlen',
    spanish: 'sentirse bien / sentirse mal',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb',
    phonetic: {
      english: '/fiːl wɛl / fiːl bæd/',
      french: '/sə sɑ̃.tiʁ bjɛ̃ / mal/',
      german: '/zɪç ɡuːt / ʃlɛçt ˈfyːlən/',
      spanish: '/senˈtiɾse βjen / mal/'
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
  {
    english: 'emergency',
    arabic: 'حالة طارئة',
    french: 'urgence',
    german: 'Notfall',
    spanish: 'emergencia',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ɪˈmɜːrdʒənsi/',
      french: '/yʁ.ʒɑ̃s/',
      german: '/ˈnoːtˌfal/',
      spanish: '/emeɾˈxensja/'
    }
  },
  {
    english: 'ambulance',
    arabic: 'سيارة إسعاف',
    french: 'ambulance',
    german: 'Krankenwagen',
    spanish: 'ambulancia',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈæmbjələns/',
      french: '/ɑ̃.by.lɑ̃s/',
      german: '/ˈkʁaŋkn̩ˌvaːɡn̩/',
      spanish: '/ambuˈlansja/'
    }
  },

  // ===================== IMAGE 1: FULL SENTENCES =====================
  {
    english: 'Health is more important than wealth.',
    arabic: 'الصحة أهم من الثروة.',
    french: 'La santé est plus importante que la richesse.',
    german: 'Gesundheit ist wichtiger als Reichtum.',
    spanish: 'La salud es más importante que la riqueza.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Eating vegetables is healthy.',
    arabic: 'أكل الخضروات صحي.',
    french: 'Manger des légumes est sain.',
    german: 'Gemüse zu essen ist gesund.',
    spanish: 'Comer verduras es saludable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Fast food can be unhealthy.',
    arabic: 'الوجبات السريعة قد تكون غير صحية.',
    french: 'La restauration rapide peut être mauvaise pour la santé.',
    german: 'Fastfood kann ungesund sein.',
    spanish: 'La comida rápida puede ser poco saludable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I feel sick today.',
    arabic: 'أشعر بالمرض اليوم.',
    french: "Je me sens malade aujourd'hui.",
    german: 'Ich fühle mich heute krank.',
    spanish: 'Me siento enfermo/a hoy.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Fever is a common symptom.',
    arabic: 'الحمى عرض شائع.',
    french: 'La fièvre est un symptôme courant.',
    german: 'Fieber ist ein häufiges Symptom.',
    spanish: 'La fiebre es un síntoma común.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I have pain in my leg.',
    arabic: 'لدي ألم في ساقي.',
    french: "J'ai mal à la jambe.",
    german: 'Ich habe Schmerzen im Bein.',
    spanish: 'Tengo dolor en la pierna.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a headache.',
    arabic: 'لدي صداع.',
    french: "J'ai mal à la tête.",
    german: 'Ich habe Kopfschmerzen.',
    spanish: 'Tengo dolor de cabeza.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a stomachache.',
    arabic: 'لدي ألم في المعدة.',
    french: "J'ai mal au ventre.",
    german: 'Ich habe Bauchschmerzen.',
    spanish: 'Tengo dolor de estómago.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a toothache.',
    arabic: 'لدي ألم في الأسنان.',
    french: "J'ai mal aux dents.",
    german: 'Ich habe Zahnschmerzen.',
    spanish: 'Tengo dolor de muelas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a backache.',
    arabic: 'لدي ألم في الظهر.',
    french: "J'ai mal au dos.",
    german: 'Ich habe Rückenschmerzen.',
    spanish: 'Tengo dolor de espalda.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She has a fever.',
    arabic: 'لديها حمى.',
    french: 'Elle a de la fièvre.',
    german: 'Sie hat Fieber.',
    spanish: 'Ella tiene fiebre.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a bad cold.',
    arabic: 'لدي نزلة برد شديدة.',
    french: "J'ai un gros rhume.",
    german: 'Ich habe eine starke Erkältung.',
    spanish: 'Tengo un resfriado fuerte.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He caught the flu.',
    arabic: 'أُصيب بالإنفلونزا.',
    french: 'Il a attrapé la grippe.',
    german: 'Er hat sich die Grippe eingefangen.',
    spanish: 'Se contagió de gripe.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I have a cough.',
    arabic: 'لدي سعال.',
    french: "J'ai de la toux.",
    german: 'Ich habe Husten.',
    spanish: 'Tengo tos.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She sneezed loudly.',
    arabic: 'عطست بصوت عالٍ.',
    french: 'Elle a éternué bruyamment.',
    german: 'Sie hat laut geniest.',
    spanish: 'Ella estornudó fuerte.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a sore throat.',
    arabic: 'لدي التهاب في الحلق.',
    french: "J'ai mal à la gorge.",
    german: 'Ich habe Halsschmerzen.',
    spanish: 'Tengo dolor de garganta.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He has a minor injury.',
    arabic: 'لديه إصابة طفيفة.',
    french: 'Il a une blessure légère.',
    german: 'Er hat eine leichte Verletzung.',
    spanish: 'Él tiene una lesión leve.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'I have a small cut on my finger.',
    arabic: 'لدي جرح صغير في إصبعي.',
    french: "J'ai une petite coupure au doigt.",
    german: 'Ich habe einen kleinen Schnitt am Finger.',
    spanish: 'Tengo un pequeño corte en el dedo.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a bruise on my arm.',
    arabic: 'لدي كدمة في ذراعي.',
    french: "J'ai un bleu au bras.",
    german: 'Ich habe einen blauen Fleck am Arm.',
    spanish: 'Tengo un moretón en el brazo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'He broke his arm last week.',
    arabic: 'كسر ذراعه الأسبوع الماضي.',
    french: "Il s'est cassé le bras la semaine dernière.",
    german: 'Er hat sich letzte Woche den Arm gebrochen.',
    spanish: 'Se rompió el brazo la semana pasada.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'Take this medicine after meals.',
    arabic: 'تناول هذا الدواء بعد الوجبات.',
    french: 'Prenez ce médicament après les repas.',
    german: 'Nehmen Sie dieses Medikament nach den Mahlzeiten.',
    spanish: 'Tome esta medicina después de las comidas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Take one tablet every morning.',
    arabic: 'تناول حبة واحدة كل صباح.',
    french: 'Prenez un comprimé chaque matin.',
    german: 'Nehmen Sie jeden Morgen eine Tablette.',
    spanish: 'Tome una pastilla cada mañana.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The doctor gave me a prescription.',
    arabic: 'أعطاني الطبيب وصفة طبية.',
    french: "Le médecin m'a donné une ordonnance.",
    german: 'Der Arzt hat mir ein Rezept gegeben.',
    spanish: 'El médico me dio una receta.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The pharmacy is open now.',
    arabic: 'الصيدلية مفتوحة الآن.',
    french: 'La pharmacie est ouverte maintenant.',
    german: 'Die Apotheke ist jetzt geöffnet.',
    spanish: 'La farmacia está abierta ahora.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I need to see a doctor.',
    arabic: 'أحتاج لرؤية طبيب.',
    french: 'Je dois voir un médecin.',
    german: 'Ich muss zum Arzt gehen.',
    spanish: 'Necesito ver a un médico.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'The nurse checked my temperature.',
    arabic: 'تحققت الممرضة من درجة حرارتي.',
    french: "L'infirmière a vérifié ma température.",
    german: 'Die Krankenschwester hat meine Temperatur gemessen.',
    spanish: 'La enfermera me revisó la temperatura.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'He was taken to the hospital.',
    arabic: 'تم نقله إلى المستشفى.',
    french: "Il a été emmené à l'hôpital.",
    german: 'Er wurde ins Krankenhaus gebracht.',
    spanish: 'Lo llevaron al hospital.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have an appointment at the clinic.',
    arabic: 'لدي موعد في العيادة.',
    french: "J'ai un rendez-vous à la clinique.",
    german: 'Ich habe einen Termin in der Klinik.',
    spanish: 'Tengo una cita en la clínica.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I have a doctor's appointment.",
    arabic: 'لدي موعد مع الطبيب.',
    french: "J'ai un rendez-vous chez le médecin.",
    german: 'Ich habe einen Arzttermin.',
    spanish: 'Tengo una cita con el médico.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I have a yearly checkup.',
    arabic: 'لدي فحص طبي سنوي.',
    french: "J'ai un bilan de santé annuel.",
    german: 'Ich habe einen jährlichen Check-up.',
    spanish: 'Tengo un chequeo anual.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'The treatment worked well.',
    arabic: 'نجح العلاج بشكل جيد.',
    french: 'Le traitement a bien fonctionné.',
    german: 'Die Behandlung hat gut funktioniert.',
    spanish: 'El tratamiento funcionó bien.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'He needs surgery on his knee.',
    arabic: 'يحتاج إلى عملية جراحية في ركبته.',
    french: "Il a besoin d'une opération au genou.",
    german: 'Er braucht eine Operation am Knie.',
    spanish: 'Necesita cirugía en la rodilla.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'She recovered quickly.',
    arabic: 'تعافت بسرعة.',
    french: "Elle s'est rétablie rapidement.",
    german: 'Sie hat sich schnell erholt.',
    spanish: 'Ella se recuperó rápidamente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'You need to rest.',
    arabic: 'تحتاج إلى الراحة.',
    french: 'Tu as besoin de te reposer.',
    german: 'Du musst dich ausruhen.',
    spanish: 'Necesitas descansar.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Exercise is good for your health.',
    arabic: 'الرياضة مفيدة لصحتك.',
    french: "L'exercice est bon pour la santé.",
    german: 'Sport ist gut für die Gesundheit.',
    spanish: 'El ejercicio es bueno para la salud.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She is on a healthy diet.',
    arabic: 'هي تتبع نظامًا غذائيًا صحيًا.',
    french: 'Elle suit un régime sain.',
    german: 'Sie hält eine gesunde Diät.',
    spanish: 'Ella sigue una dieta saludable.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I need more sleep.',
    arabic: 'أحتاج إلى مزيد من النوم.',
    french: "J'ai besoin de plus de sommeil.",
    german: 'Ich brauche mehr Schlaf.',
    spanish: 'Necesito dormir más.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Work causes him a lot of stress.',
    arabic: 'يسبب له العمل الكثير من التوتر.',
    french: 'Le travail lui cause beaucoup de stress.',
    german: 'Die Arbeit verursacht ihm viel Stress.',
    spanish: 'El trabajo le causa mucho estrés.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "I'm really tired.",
    arabic: 'أنا متعب جدًا.',
    french: 'Je suis vraiment fatigué(e).',
    german: 'Ich bin wirklich müde.',
    spanish: 'Estoy muy cansado/a.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'She always feels energetic.',
    arabic: 'تشعر دائمًا بالنشاط.',
    french: "Elle se sent toujours pleine d'énergie.",
    german: 'Sie fühlt sich immer energiegeladen.',
    spanish: 'Ella siempre se siente enérgica.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: "I don't feel well today.",
    arabic: 'لا أشعر أنني بخير اليوم.',
    french: "Je ne me sens pas bien aujourd'hui.",
    german: 'Ich fühle mich heute nicht gut.',
    spanish: 'No me siento bien hoy.',
    type: 'sentence',
    cefr: 'A1',
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
  {
    english: 'This is a medical emergency.',
    arabic: 'هذه حالة طبية طارئة.',
    french: "C'est une urgence médicale.",
    german: 'Das ist ein medizinischer Notfall.',
    spanish: 'Esta es una emergencia médica.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'phrase'
  },
  {
    english: 'They called an ambulance.',
    arabic: 'اتصلوا بسيارة إسعاف.',
    french: 'Ils ont appelé une ambulance.',
    german: 'Sie haben einen Krankenwagen gerufen.',
    spanish: 'Llamaron a una ambulancia.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== IMAGE 2: CONVERSATIONAL EXPRESSIONS =====================
  {
    english: "I don't feel well",
    arabic: 'لا أشعر أنني بخير',
    french: 'Je ne me sens pas bien',
    german: 'Ich fühle mich nicht gut',
    spanish: 'No me siento bien',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'How are you feeling?',
    arabic: 'كيف تشعر؟',
    french: 'Comment te sens-tu ?',
    german: 'Wie fühlst du dich?',
    spanish: '¿Cómo te sientes?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'I feel better now',
    arabic: 'أشعر بتحسن الآن',
    french: 'Je me sens mieux maintenant',
    german: 'Mir geht es jetzt besser',
    spanish: 'Ahora me siento mejor',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Take this medicine twice a day',
    arabic: 'خذ هذا الدواء مرتين يوميًا',
    french: 'Prenez ce médicament deux fois par jour',
    german: 'Nehmen Sie dieses Medikament zweimal täglich',
    spanish: 'Tome esta medicina dos veces al día',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Get well soon',
    arabic: 'أتمنى لك الشفاء العاجل',
    french: 'Bon rétablissement',
    german: 'Gute Besserung',
    spanish: 'Que te mejores pronto',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: "I'd like to make an appointment",
    arabic: 'أريد حجز موعد',
    french: 'Je voudrais prendre rendez-vous',
    german: 'Ich möchte einen Termin vereinbaren',
    spanish: 'Quisiera pedir una cita',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'What are your symptoms?',
    arabic: 'ما هي أعراضك؟',
    french: 'Quels sont vos symptômes ?',
    german: 'Was sind Ihre Symptome?',
    spanish: '¿Cuáles son sus síntomas?',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },
  {
    english: 'Call an ambulance!',
    arabic: 'اتصل بسيارة إسعاف!',
    french: 'Appelez une ambulance !',
    german: 'Rufen Sie einen Krankenwagen!',
    spanish: '¡Llame a una ambulancia!',
    type: 'sentence',
    cefr: 'A1',
    pos: 'phrase'
  },

  // ===================== ADDITIONAL FEELINGS & MEDICAL UNITS =====================
  {
    english: 'happy',
    arabic: 'سعيد',
    french: 'heureux/heureuse',
    german: 'glücklich',
    spanish: 'feliz',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈhæpi/',
      french: '/œ.ʁø/',
      german: '/ˈɡlʏklɪç/',
      spanish: '/feˈlis/'
    }
  },
  {
    english: 'sad',
    arabic: 'حزين',
    french: 'triste',
    german: 'traurig',
    spanish: 'triste',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/sæd/',
      french: '/tʁist/',
      german: '/ˈtʁaʊ̯ʁɪç/',
      spanish: '/ˈtɾiste/'
    }
  },
  {
    english: 'angry',
    arabic: 'غاضب',
    french: 'en colère',
    german: 'wütend',
    spanish: 'enojado/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈæŋɡri/',
      french: '/ɑ̃ kɔ.lɛʁ/',
      german: '/ˈvyːtn̩t/',
      spanish: '/enoˈxaðo/'
    }
  },
  {
    english: 'worried / anxious',
    arabic: 'قلق',
    french: 'inquiet/inquiète',
    german: 'besorgt/ängstlich',
    spanish: 'preocupado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈwʌrid / ˈæŋkʃəs/',
      french: '/ɛ̃.kjɛ/',
      german: '/bəˈzɔʁkt/',
      spanish: '/pɾeokuˈpaðo/'
    }
  },
  {
    english: 'nervous',
    arabic: 'متوتر / عصبي',
    french: 'nerveux/nerveuse',
    german: 'nervös',
    spanish: 'nervioso/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ˈnɜːrvəs/',
      french: '/nɛʁ.vø/',
      german: '/nɛʁˈvøːs/',
      spanish: '/neɾˈβjoso/'
    }
  },
  {
    english: 'relaxed',
    arabic: 'مسترخٍ',
    french: 'détendu(e)',
    german: 'entspannt',
    spanish: 'relajado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/rɪˈlækst/',
      french: '/de.tɑ̃.dy/',
      german: '/ɛntˈʃpant/',
      spanish: '/relaˈxaðo/'
    }
  },
  {
    english: 'bandage',
    arabic: 'ضمادة',
    french: 'pansement/bandage',
    german: 'Verband/Pflaster',
    spanish: 'vendaje/tirita',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈbændɪdʒ/',
      french: '/pɑ̃s.mɑ̃/',
      german: '/fɛɐ̯ˈbant/',
      spanish: '/benˈdaxe/'
    }
  },
  {
    english: 'first aid',
    arabic: 'الإسعافات الأولية',
    french: 'premiers secours',
    german: 'Erste Hilfe',
    spanish: 'primeros auxilios',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˌfɜːrst ˈeɪd/',
      french: '/pʁə.mje sə.kuʁ/',
      german: '/ˈeːɐ̯stə ˈhɪlfə/',
      spanish: '/pɾiˈmeɾos awkˈsiljos/'
    }
  },
  {
    english: 'thermometer',
    arabic: 'ميزان الحرارة',
    french: 'thermomètre',
    german: 'Fieberthermometer',
    spanish: 'termómetro',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/θərˈmɒmɪtər/',
      french: '/tɛʁ.mɔ.mɛtʁ/',
      german: '/tɛʁmoˈmeːtɐ/',
      spanish: '/teɾˈmometɾo/'
    }
  },
  {
    english: 'painkiller',
    arabic: 'مسكن للألم',
    french: 'analgésique/antidouleur',
    german: 'Schmerzmittel',
    spanish: 'analgésico',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈpeɪnˌkɪlər/',
      french: '/ɑ̃.ti.du.lœʁ/',
      german: '/ˈʃmɛʁtsˌmɪtl̩/',
      spanish: '/analˈxesiko/'
    }
  },
  {
    english: 'dizzy',
    arabic: 'دايخ / يشعر بالدوار',
    french: 'pris(e) de vertige / étourdi(e)',
    german: 'schwindelig',
    spanish: 'mareado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈdɪzi/',
      french: '/e.tuʁ.di/',
      german: '/ˈʃvɪndəlɪç/',
      spanish: '/maɾeˈaðo/'
    }
  },
  {
    english: 'take care of yourself',
    arabic: 'اعتنِ بنفسك',
    french: 'prends soin de toi',
    german: 'pass auf dich auf',
    spanish: 'cuídate',
    type: 'chunk',
    cefr: 'A1',
    pos: 'phrase',
    phonetic: {
      english: '/teɪk kɛər əv jʊərˈsɛlf/',
      french: '/pʁɑ̃ swɛ̃ də twa/',
      german: '/pas aʊf dɪç aʊf/',
      spanish: '/ˈkwiðate/'
    }
  },
  {
    english: 'excited',
    arabic: 'متحمس',
    french: 'excité(e) / enthousiaste',
    german: 'aufgeregt / begeistert',
    spanish: 'emocionado/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ɪkˈsaɪtɪd/',
      french: '/ɛk.si.te/',
      german: '/ˈaʊfɡəˌʁeːkt/',
      spanish: '/emosjoˈnaðo/'
    }
  },
  {
    english: 'bored',
    arabic: 'يشعر بالملل / ضجران',
    french: 'ennuyé(e)',
    german: 'gelangweilt',
    spanish: 'aburrido/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/bɔːrd/',
      french: '/ɑ̃.nɥi.je/',
      german: '/ɡəˈlaŋvaɪ̯lt/',
      spanish: '/abuˈriðo/'
    }
  },
  {
    english: 'scared / afraid',
    arabic: 'خائف / مذعور',
    french: 'effrayé(e) / avoir peur',
    german: 'ängstlich / verängstigt',
    spanish: 'asustado/a / con miedo',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/skɛərd / əˈfreɪd/',
      french: '/e.fʁɛ.je/',
      german: '/ˈɛŋstlɪç/',
      spanish: '/asusˈtaðo/'
    }
  },
  {
    english: 'surprised',
    arabic: 'متفاجئ / مندهش',
    french: 'surpris(e)',
    german: 'überrascht',
    spanish: 'sorprendido/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/sərˈpraɪzd/',
      french: '/syʁ.pʁi/',
      german: '/yːbɐˈʁaʃt/',
      spanish: '/soɾpɾenˈdiðo/'
    }
  },
  {
    english: 'proud',
    arabic: 'فخور',
    french: 'fier / fière',
    german: 'stolz',
    spanish: 'orgulloso/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/praʊd/',
      french: '/fjɛʁ/',
      german: '/ʃtɔlts/',
      spanish: '/oɾɡuˈʎoso/'
    }
  },
  {
    english: 'embarrassed',
    arabic: 'محرج / خجلان',
    french: 'gêné(e) / embarrassé(e)',
    german: 'verlegen / peinlich berührt',
    spanish: 'avergonzado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ɪmˈbærəst/',
      french: '/ɑ̃.ba.ʁa.se/',
      german: '/fɛɐ̯ˈleːɡn̩/',
      spanish: '/abeɾɣonˈsaðo/'
    }
  },
  {
    english: 'confused',
    arabic: 'مرتبك / في حيرة',
    french: 'confus(e)',
    german: 'verwirrt',
    spanish: 'confundido/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/kənˈfjuːzd/',
      french: '/kɔ̃.fy/',
      german: '/fɛɐ̯ˈvɪʁt/',
      spanish: '/komfunˈdiðo/'
    }
  },
  {
    english: 'lonely',
    arabic: 'وحيد / يشعر بالوحدة',
    french: 'seul(e) / solitaire',
    german: 'einsam',
    spanish: 'solitario/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈloʊnli/',
      french: '/sœl/',
      german: '/ˈaɪ̯nzaːm/',
      spanish: '/soliˈtaɾjo/'
    }
  },
  {
    english: 'jealous',
    arabic: 'غيور / يشعر بالغيرة',
    french: 'jaloux / jalouse',
    german: 'eifersüchtig',
    spanish: 'celoso/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈdʒɛləs/',
      french: '/ʒa.lu/',
      german: '/ˈaɪ̯fɐˌzʏçtɪç/',
      spanish: '/seˈloso/'
    }
  },
  {
    english: 'grateful / thankful',
    arabic: 'ممتن / شاكر',
    french: 'reconnaissant(e)',
    german: 'dankbar',
    spanish: 'agradecido/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈɡreɪtfʊl/',
      french: '/ʁə.kɔ.nɛ.sɑ̃/',
      german: '/ˈdaŋkbaːɐ̯/',
      spanish: '/aɣɾaðeˈsiðo/'
    }
  },
  {
    english: 'hopeful',
    arabic: 'متفائل / مفعم بالأمل',
    french: 'plein d’espoir / optimiste',
    german: 'hoffnungsvoll',
    spanish: 'esperanzado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈhoʊpfʊl/',
      french: '/ɔp.ti.mist/',
      german: '/ˈhɔfnʊŋsfɔl/',
      spanish: '/espeɾanˈsaðo/'
    }
  },
  {
    english: 'calm / peaceful',
    arabic: 'هادئ / مطمئن',
    french: 'calme / serein(e)',
    german: 'ruhig / gelassen',
    spanish: 'calmado/a / tranquilo/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/kɑːm/',
      french: '/kalm/',
      german: '/ˈʁuːɪç/',
      spanish: '/kaweb.org/'
    }
  },
  {
    english: 'disappointed',
    arabic: 'محبط / خائب الأمل',
    french: 'déçu(e)',
    german: 'enttäuscht',
    spanish: 'decepcionado/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˌdɪsəˈpɔɪntɪd/',
      french: '/de.sy/',
      german: '/ɛntˈtɔɪ̯ʃt/',
      spanish: '/desepsejoˈnaðo/'
    }
  },
  {
    english: 'shy',
    arabic: 'خجول',
    french: 'timide',
    german: 'schüchtern',
    spanish: 'tímido/a',
    type: 'word',
    cefr: 'A1',
    pos: 'adjective',
    phonetic: {
      english: '/ʃaɪ/',
      french: '/ti.mid/',
      german: '/ˈʃʏçtɐn/',
      spanish: '/ˈtimiðo/'
    }
  },
  {
    english: 'confident',
    arabic: 'واثق من نفسه',
    french: 'sûr(e) de soi / confiant(e)',
    german: 'selbstbewusst',
    spanish: 'seguro/a de sí mismo/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈkɒnfɪdənt/',
      french: '/kɔ̃.fjɑ̃/',
      german: '/ˈzɛlpstbəˌvʊst/',
      spanish: '/komˈfjante/'
    }
  },
  {
    english: 'curious',
    arabic: 'فضولي',
    french: 'curieux / curieuse',
    german: 'neugierig',
    spanish: 'curioso/a',
    type: 'word',
    cefr: 'A2',
    pos: 'adjective',
    phonetic: {
      english: '/ˈkjʊəriəs/',
      french: '/ky.ʁjø/',
      german: '/ˈnɔɪ̯ˌɡiːʁɪç/',
      spanish: '/kuˈɾjoso/'
    }
  },
  {
    english: 'mood',
    arabic: 'مزاج / حالة نفسية',
    french: 'humeur',
    german: 'Laune / Stimmung',
    spanish: 'estado de ánimo / humor',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/muːd/',
      french: '/y.mœʁ/',
      german: '/ˈlaʊ̯nə/',
      spanish: '/uˈmoɾ/'
    }
  },
  {
    english: 'in a good mood',
    arabic: 'في مزاج جيد',
    french: 'de bonne humeur',
    german: 'guter Laune',
    spanish: 'de buen humor',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/ɪn ə ɡʊd muːd/',
      french: '/də bɔn y.mœʁ/',
      german: '/ˈɡuːtɐ ˈlaʊ̯nə/',
      spanish: '/de bwen uˈmoɾ/'
    }
  },
  {
    english: 'in a bad mood',
    arabic: 'في مزاج سيئ',
    french: 'de mauvaise humeur',
    german: 'schlechter Laune',
    spanish: 'de mal humor',
    type: 'chunk',
    cefr: 'A2',
    pos: 'phrase',
    phonetic: {
      english: '/ɪn ə bæd muːd/',
      french: '/də mo.vɛz y.mœʁ/',
      german: '/ˈʃlɛçtɐ ˈlaʊ̯nə/',
      spanish: '/de mal uˈmoɾ/'
    }
  },
  {
    english: 'nausea / nauseous',
    arabic: 'غثيان / يشعر بالغثيان',
    french: 'nausée / nauséeux',
    german: 'Übelkeit / übel',
    spanish: 'náuseas / mareado',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈnɔːziə / ˈnɔːʃəs/',
      french: '/no.ze/',
      german: '/ˈyːbl̩kaɪ̯t/',
      spanish: '/ˈnawseas/'
    }
  },
  {
    english: 'vomit / throw up',
    arabic: 'يتقيأ / يستفرغ',
    french: 'vomir',
    german: 'sich übergeben / erbrechen',
    spanish: 'vomitar',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/ˈvɒmɪt / θroʊ ʌp/',
      french: '/vɔ.miʁ/',
      german: '/ɛɐ̯ˈbʁɛçn̩/',
      spanish: '/bomiˈtaɾ/'
    }
  },
  {
    english: 'faint / pass out',
    arabic: 'يغمى عليه / يفقد الوعي',
    french: 's’évanouir',
    german: 'ohnmächtig werden',
    spanish: 'desmayarse',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/feɪnt / pæs aʊt/',
      french: '/se.va.nwiʁ/',
      german: '/ˈoːnˌmɛçtɪç ˈveːɐ̯dn̩/',
      spanish: '/desmaˈʝaɾse/'
    }
  },
  {
    english: 'bleed / bleeding',
    arabic: 'ينزف / نزيف',
    french: 'saigner / saignement',
    german: 'bluten / Blutung',
    spanish: 'sangrar / sangrado',
    type: 'word',
    cefr: 'A2',
    pos: 'verb',
    phonetic: {
      english: '/bliːd / ˈbliːdɪŋ/',
      french: '/sɛ.ɲe/',
      german: '/ˈbluːtn̩/',
      spanish: '/saŋˈɡɾaɾ/'
    }
  },
  {
    english: 'burn',
    arabic: 'حرق / يصاب بحروق',
    french: 'brûlure / brûler',
    german: 'Verbrennung / verbrennen',
    spanish: 'quemadura / quemar',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/bɜːrn/',
      french: '/bʁy.lyʁ/',
      german: '/fɛɐ̯ˈbʁɛnʊŋ/',
      spanish: '/kemaˈðuɾa/'
    }
  },
  {
    english: 'plaster / band-aid',
    arabic: 'لاصق جروح طبي',
    french: 'pansement / sparadrap',
    german: 'Pflaster',
    spanish: 'tirita / curita',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈplɑːstər / ˈbændeɪd/',
      french: '/pɑ̃s.mɑ̃/',
      german: '/ˈpflastɐ/',
      spanish: '/tiˈɾita/'
    }
  },
  {
    english: 'injection / shot',
    arabic: 'حقنة طبية / إبرة',
    french: 'piqûre / injection',
    german: 'Spritze / Injektion',
    spanish: 'inyección',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ɪnˈdʒɛkʃən / ʃɒt/',
      french: '/pi.kyʁ/',
      german: '/ˈʃpʁɪtsə/',
      spanish: '/iɲʝekˈsjon/'
    }
  },
  {
    english: 'blood pressure',
    arabic: 'ضغط الدم',
    french: 'tension artérielle',
    german: 'Blutdruck',
    spanish: 'presión arterial',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/blʌd ˈprɛʃər/',
      french: '/tɑ̃.sjɔ̃/',
      german: '/ˈbluːtˌdʁʊk/',
      spanish: '/pɾeˈsjon aɾteˈɾjal/'
    }
  },
  {
    english: 'blood test',
    arabic: 'تحليل دم / فحص دم',
    french: 'prise de sang / analyse de sang',
    german: 'Bluttest / Blutuntersuchung',
    spanish: 'análisis de sangre',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/blʌd tɛst/',
      french: '/pʁiz də sɑ̃/',
      german: '/ˈbluːtˌtɛst/',
      spanish: '/aˈnalisis de ˈsaŋɡɾe/'
    }
  },
  {
    english: 'heart rate / pulse',
    arabic: 'نبض القلب / معدل ضربات القلب',
    french: 'pouls / rythme cardiaque',
    german: 'Puls / Herzfrequenz',
    spanish: 'pulso / frecuencia cardíaca',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/hɑːrt reɪt / pʌls/',
      french: '/pu/',
      german: '/pʊls/',
      spanish: '/ˈpulso/'
    }
  },
  {
    english: 'antibiotics',
    arabic: 'مضاد حيوي',
    french: 'antibiotique',
    german: 'Antibiotika',
    spanish: 'antibióticos',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˌæntibaɪˈɒtɪks/',
      french: '/ɑ̃.ti.bjɔ.tik/',
      german: '/antiˈbi̯oːtika/',
      spanish: '/antibjoˈtikos/'
    }
  },
  {
    english: 'ointment / cream',
    arabic: 'مرهم طبي / كريم',
    french: 'pommade / crème',
    german: 'Salbe / Creme',
    spanish: 'pomada / crema',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈɔɪntmənt / kriːm/',
      french: '/pɔ.mad/',
      german: '/ˈzalbə/',
      spanish: '/poˈmaða/'
    }
  },
  {
    english: 'dentist',
    arabic: 'طبيب أسنان',
    french: 'dentiste',
    german: 'Zahnarzt / Zahnärztin',
    spanish: 'dentista',
    type: 'word',
    cefr: 'A1',
    pos: 'noun',
    phonetic: {
      english: '/ˈdɛntɪst/',
      french: '/dɑ̃.tist/',
      german: '/ˈtsaːnˌʔaːɐ̯tst/',
      spanish: '/denˈtista/'
    }
  },
  {
    english: 'patient',
    arabic: 'مريض (في المستشفى/العيادة)',
    french: 'patient(e)',
    german: 'Patient / Patientin',
    spanish: 'paciente',
    type: 'word',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈpeɪʃənt/',
      french: '/pa.sjɑ̃/',
      german: '/paˈtsi̯ɛnt/',
      spanish: '/paˈsjente/'
    }
  },
  {
    english: 'mental health',
    arabic: 'الصحة النفسية / العقلية',
    french: 'santé mentale',
    german: 'psychische Gesundheit',
    spanish: 'salud mental',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈmɛntəl hɛlθ/',
      french: '/sɑ̃.te mɑ̃.tal/',
      german: '/ˈpsyːçɪʃə ɡəˈzʊntˌhaɪ̯t/',
      spanish: '/saˈluð menˈtal/'
    }
  },
  {
    english: 'physical health',
    arabic: 'الصحة البدنية / الجسدية',
    french: 'santé physique',
    german: 'körperliche Gesundheit',
    spanish: 'salud física',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun',
    phonetic: {
      english: '/ˈfɪzɪkəl hɛlθ/',
      french: '/sɑ̃.te fi.zik/',
      german: '/ˈkœʁpɐlɪçə ɡəˈzʊntˌhaɪ̯t/',
      spanish: '/saˈluð ˈfisika/'
    }
  },
  {
    english: 'I am so excited about our upcoming trip.',
    arabic: 'أنا متحمس جدًا لرحلتنا القادمة.',
    french: 'Je suis très enthousiaste pour notre prochain voyage.',
    german: 'Ich freue mich sehr auf unsere bevorstehende Reise.',
    spanish: 'Estoy muy emocionado por nuestro próximo viaje.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'sentence',
    phonetic: {
      english: '/aɪ æm soʊ ɪkˈsaɪtɪd/',
      french: '/ʒə sɥi tʁɛ.zɑ̃.tu.zjast/',
      german: '/ɪç ˈfʁɔɪ̯ə mɪç zeːɐ̯/',
      spanish: '/esˈtoj mwi emosjoˈnaðo/'
    }
  },
  {
    english: 'He feels bored during the long lecture.',
    arabic: 'يشعر بالملل أثناء المحاضرة الطويلة.',
    french: 'Il s’ennuie pendant la longue conférence.',
    german: 'Er langweilt sich während der langen Vorlesung.',
    spanish: 'Se siente aburrido durante la larga conferencia.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/hiː fiːlz bɔːrd/',
      french: '/il sɑ̃.nɥi/',
      german: '/eːɐ̯ ˈlaŋvaɪ̯lt zɪç/',
      spanish: '/se ˈsjente abuˈriðo/'
    }
  },
  {
    english: 'She is afraid of spiders.',
    arabic: 'هي تخاف من العناكب.',
    french: 'Elle a peur des araignées.',
    german: 'Sie hat Angst vor Spinnen.',
    spanish: 'Ella tiene miedo de las arañas.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'sentence',
    phonetic: {
      english: '/ʃiː ɪz əˈfreɪd əv ˈspaɪdərz/',
      french: '/ɛl o pœʁ de.za.ʁɛ.ɲe/',
      german: '/ziː hat aŋst foːɐ̯ ˈʃpɪnən/',
      spanish: '/ˈeʎa ˈtjene ˈmjeðo/'
    }
  },
  {
    english: 'I am really proud of your hard work.',
    arabic: 'أنا فخور حقًا بعملك الجاد.',
    french: 'Je suis vraiment fier de ton travail acharné.',
    german: 'Ich bin wirklich stolz auf deine harte Arbeit.',
    spanish: 'Estoy muy orgulloso de tu arduo trabajo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/aɪ æm ˈrɪəli praʊd/',
      french: '/ʒə sɥi vʁɛ.mɑ̃ fjɛʁ/',
      german: '/ɪç bɪn ˈvɪʁklɪç ʃtɔlts/',
      spanish: '/esˈtoj mwi oɾɡuˈʎoso/'
    }
  },
  {
    english: 'I feel grateful for your kind support.',
    arabic: 'أشعر بالامتنان لدعمك اللطيف.',
    french: 'Je suis reconnaissant pour votre précieux soutien.',
    german: 'Ich bin dankbar für deine freundliche Unterstützung.',
    spanish: 'Me siento agradecido por tu amable apoyo.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/aɪ fiːl ˈɡreɪtfʊl/',
      french: '/ʒə sɥi ʁə.kɔ.nɛ.sɑ̃/',
      german: '/ɪç bɪn ˈdaŋkbaːɐ̯/',
      spanish: '/me ˈsjento aɣɾaðeˈsiðo/'
    }
  },
  {
    english: 'Please stay calm and take a deep breath.',
    arabic: 'يرجى التزام الهدوء وأخذ نفس عميق.',
    french: 'S’il vous plaît, restez calme et respirez profondément.',
    german: 'Bitte bleib ruhig und atme tief durch.',
    spanish: 'Por favor mantén la calma y respira profundamente.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/pliːz steɪ kɑːm/',
      french: '/ʁɛs.te kalm/',
      german: '/blaɪ̯p ˈʁuːɪç/',
      spanish: '/manˈten la ˈkalma/'
    }
  },
  {
    english: 'He is in a very good mood this morning.',
    arabic: 'هو في مزاج جيد جدًا هذا الصباح.',
    french: 'Il est de très bonne humeur ce matin.',
    german: 'Er ist heute Morgen sehr guter Laune.',
    spanish: 'Él está de muy buen humor esta mañana.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/hiː ɪz ɪn ə ˈvɛri ɡʊd muːd/',
      french: '/il ɛ də bɔn y.mœʁ/',
      german: '/eːɐ̯ ɪst ˈɡuːtɐ ˈlaʊ̯nə/',
      spanish: '/el esˈta de bwen uˈmoɾ/'
    }
  },
  {
    english: 'The nurse measured my blood pressure.',
    arabic: 'قامت الممرضة بقياس ضغط دمي.',
    french: 'L’infirmière a mesuré ma tension.',
    german: 'Die Krankenschwester hat meinen Blutdruck gemessen.',
    spanish: 'La enfermera me tomó la presión arterial.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/ðə nɜːrs ˈmɛʒərd maɪ blʌd ˈprɛʃər/',
      french: '/lɛ̃.fiʁ.mjɛʁ a mə.zy.ʁe/',
      german: '/diː ˈkʁaŋkn̩ˌʃvɛstɐ hat ˈɡəˈmɛsn̩/',
      spanish: '/la enfeɾˈmeɾa me toˈmo la pɾeˈsjon/'
    }
  },
  {
    english: 'The doctor gave me a quick injection.',
    arabic: 'أعطاني الطبيب حقنة سريعة.',
    french: 'Le médecin m’a fait une injection rapide.',
    german: 'Der Arzt gab mir eine schnelle Spritze.',
    spanish: 'El médico me puso una inyección rápida.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/ðə ˈdɒktər ɡeɪv miː ə kwɪk ɪnˈdʒɛkʃən/',
      french: '/lə mɛd.sɛ̃ ma fɛ yn pi.kyʁ/',
      german: '/deːɐ̯ aːɐ̯tst ɡaːp miːɐ̯ aɪ̯nə ˈʃpʁɪtsə/',
      spanish: '/el ˈmeðiko me ˈpuso/'
    }
  },
  {
    english: 'Put a plaster on that small cut.',
    arabic: 'ضع لاصق جروح على ذلك الجرح الصغير.',
    french: 'Mets un pansement sur cette petite coupure.',
    german: 'Kleb ein Pflaster auf diesen kleinen Schnitt.',
    spanish: 'Ponte una tirita en ese pequeño corte.',
    type: 'sentence',
    cefr: 'A1',
    pos: 'sentence',
    phonetic: {
      english: '/pʊt ə ˈplɑːstər/',
      french: '/mɛ œ̃ pɑ̃s.mɑ̃/',
      german: '/kleːp aɪ̯n ˈpflastɐ/',
      spanish: '/ˈponte ˈuna tiˈɾita/'
    }
  },
  {
    english: 'He needs to take antibiotics for one week.',
    arabic: 'يحتاج إلى تناول المضادات الحيوية لمدة أسبوع.',
    french: 'Il doit prendre des antibiotiques pendant une semaine.',
    german: 'Er muss eine Woche lang Antibiotika einnehmen.',
    spanish: 'Necesita tomar antibióticos durante una semana.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/hiː niːdz tuː teɪk ˌæntibaɪˈɒtɪks/',
      french: '/il dwa pʁɑ̃dʁ de.zɑ̃.ti.bjɔ.tik/',
      german: '/eːɐ̯ mʊs antiˈbi̯oːtika aɪ̯nˈneːmən/',
      spanish: '/neseˈsita toˈmaɾ antibjoˈtikos/'
    }
  },
  {
    english: 'Mental health is just as important as physical health.',
    arabic: 'الصحة النفسية لا تقل أهمية عن الصحة الجسدية.',
    french: 'La santé mentale est tout aussi importante que la santé physique.',
    german: 'Die psychische Gesundheit ist genauso wichtig wie die körperliche.',
    spanish: 'La salud mental es tan importante como la salud física.',
    type: 'sentence',
    cefr: 'A2',
    pos: 'sentence',
    phonetic: {
      english: '/ˈmɛntəl hɛlθ ɪz dʒʌst æz ɪmˈpɔːrtənt/',
      french: '/la sɑ̃.te mɑ̃.tal ɛ tʊ.to.si/',
      german: '/diː ˈpsyːçɪʃə ɡəˈzʊntˌhaɪ̯t ɪst ɡəˈnaʊ̯zoː/',
      spanish: '/la saˈluð menˈtal es tan impoɾˈtante/'
    }
  }
];
