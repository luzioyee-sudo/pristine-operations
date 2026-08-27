// @ts-nocheck
export interface TopicItemRow {
  english: string;
  arabic: string;
  french: string;
  german: string;
  spanish: string;
  chinese: string;
  japanese: string;
  type: 'word' | 'chunk' | 'sentence';
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  pos?: string;
  phonetic?: {
    english?: string;
    french?: string;
    german?: string;
    spanish?: string;
    arabic?: string;
    chinese?: string;
    japanese?: string;
  };
}

export const DAILY_ROUTINE_DATA: TopicItemRow[] = [
  // ===================== MORNING ROUTINE (WAKE UP & HYGIENE) =====================
  {
    english: 'wake up',
    arabic: 'يستيقظ',
    french: 'se réveiller',
    german: 'aufwachen',
    spanish: 'despertarse',
    chinese: '醒来',
    japanese: '目が覚める',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: { english: '/weɪk ʌp/', french: '/sə ʁe.vɛ.je/', german: '/ˈaʊfˌvaxn̩/', spanish: '/despeɾˈtaɾse/', chinese: 'xǐng lái', japanese: 'me ga sameru' }
  },
  {
    english: 'get up',
    arabic: 'ينهض',
    french: 'se lever',
    german: 'aufstehen',
    spanish: 'levantarse',
    chinese: '起床',
    japanese: '起きる',
    type: 'word',
    cefr: 'A1',
    pos: 'verb',
    phonetic: { english: '/ɡɛt ʌp/', french: '/sə lə.ve/', german: '/ˈaʊfˌʃteːən/', spanish: '/leβanˈtaɾse/', chinese: 'qǐ chuáng', japanese: 'okiru' }
  },
  {
    english: 'stretch',
    arabic: 'يتمدد',
    french: 's\'étirer',
    german: 'sich dehnen',
    spanish: 'estirarse',
    chinese: '伸展',
    japanese: 'ストレッチする',
    type: 'word',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'open the curtains',
    arabic: 'يفتح الستائر',
    french: 'ouvrir les rideaux',
    german: 'die Vorhänge öffnen',
    spanish: 'abrir las cortinas',
    chinese: '拉开窗帘',
    japanese: 'カーテンを開ける',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'make the bed',
    arabic: 'يرتب السرير',
    french: 'faire le lit',
    german: 'das Bett machen',
    spanish: 'hacer la cama',
    chinese: '整理床铺',
    japanese: 'ベッドメイキングをする',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'brush teeth',
    arabic: 'ينظف أسنانه',
    french: 'se brosser les dents',
    german: 'Zähne putzen',
    spanish: 'lavarse los dientes',
    chinese: '刷牙',
    japanese: '歯を磨く',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'floss',
    arabic: 'ينظف بالخيط',
    french: 'utiliser du fil dentaire',
    german: 'Zahnseide benutzen',
    spanish: 'usar hilo dental',
    chinese: '用牙线',
    japanese: 'フロスをする',
    type: 'word',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'wash face',
    arabic: 'يغسل وجهه',
    french: 'se laver le visage',
    german: 'das Gesicht waschen',
    spanish: 'lavarse la cara',
    chinese: '洗脸',
    japanese: '顔を洗う',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'shower',
    arabic: 'يستحم',
    french: 'se doucher',
    german: 'duschen',
    spanish: 'ducharse',
    chinese: '淋浴',
    japanese: 'シャワーを浴びる',
    type: 'word',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'shampoo',
    arabic: 'شامبو / يغسل بالشامبو',
    french: 'shampoing',
    german: 'Shampoo',
    spanish: 'champú',
    chinese: '洗发水',
    japanese: 'シャンプー',
    type: 'word',
    cefr: 'A2',
    pos: 'noun'
  },
  {
    english: 'dry off',
    arabic: 'يتنشف',
    french: 'se sécher',
    german: 'sich abtrocknen',
    spanish: 'secarse',
    chinese: '擦干',
    japanese: '体を拭く',
    type: 'word',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'blow-dry hair',
    arabic: 'يجفف شعره بالمجفف',
    french: 'se sécher les cheveux',
    german: 'sich die Haare föhnen',
    spanish: 'secarse el pelo con secador',
    chinese: '吹头发',
    japanese: 'ドライヤーで髪を乾かす',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'shave',
    arabic: 'يحلق',
    french: 'se raser',
    german: 'rasieren',
    spanish: 'afeitarse',
    chinese: '刮胡子',
    japanese: '髭を剃る',
    type: 'word',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'get dressed',
    arabic: 'يرتدي ملابسه',
    french: "s'habiller",
    german: 'sich anziehen',
    spanish: 'vestirse',
    chinese: '穿衣服',
    japanese: '服を着る',
    type: 'word',
    cefr: 'A1',
    pos: 'verb'
  },

  // ===================== BREAKFAST & PREPARATION =====================
  {
    english: 'make breakfast',
    arabic: 'يعد الفطور',
    french: 'préparer le petit-déjeuner',
    german: 'Frühstück machen',
    spanish: 'preparar el desayuno',
    chinese: '做早餐',
    japanese: '朝食を作る',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'boil eggs',
    arabic: 'يسلق البيض',
    french: 'faire bouillir des œufs',
    german: 'Eier kochen',
    spanish: 'hervir huevos',
    chinese: '煮蛋',
    japanese: '卵を茹でる',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'toast bread',
    arabic: 'يحمص الخبز',
    french: 'faire griller du pain',
    german: 'Brot toasten',
    spanish: 'tostar pan',
    chinese: '烤面包',
    japanese: 'パンをトーストする',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'drink tea',
    arabic: 'يشرب الشاي',
    french: 'boire du thé',
    german: 'Tee trinken',
    spanish: 'beber té',
    chinese: '喝茶',
    japanese: 'お茶を飲む',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'pack lunch',
    arabic: 'يجهز الغداء',
    french: 'préparer son déjeuner',
    german: 'sein Mittagessen einpacken',
    spanish: 'preparar la comida / el almuerzo',
    chinese: '准备午饭',
    japanese: 'お弁当を準備する',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'check the weather',
    arabic: 'يتفقد الطقس',
    french: 'consulter la météo',
    german: 'das Wetter checken',
    spanish: 'mirar el tiempo / clima',
    chinese: '查看天气',
    japanese: '天気をチェックする',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'feed the pet',
    arabic: 'يطعم الحيوان الأليف',
    french: 'nourrir l\'animal',
    german: 'das Haustier füttern',
    spanish: 'dar de comer a la mascota',
    chinese: '喂宠物',
    japanese: 'ペットに餌をやる',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },

  // ===================== COMMUTING =====================
  {
    english: 'walk to the station',
    arabic: 'يمشي للمحطة',
    french: 'marcher jusqu\'à la station',
    german: 'zum Bahnhof laufen',
    spanish: 'caminar a la estación',
    chinese: '走到车站',
    japanese: '駅まで歩く',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'wait for the bus',
    arabic: 'ينتظر الحافلة',
    french: 'attendre le bus',
    german: 'auf den Bus warten',
    spanish: 'esperar el autobús',
    chinese: '等公交车',
    japanese: 'バスを待つ',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'buy a ticket',
    arabic: 'يشتري تذكرة',
    french: 'acheter un billet',
    german: 'eine Fahrkarte kaufen',
    spanish: 'comprar un billete / boleto',
    chinese: '买票',
    japanese: '切符を買う',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'traffic jam',
    arabic: 'ازدحام مروري',
    french: 'embouteillage',
    german: 'Stau',
    spanish: 'atasco / tráfico',
    chinese: '堵车',
    japanese: '交通渋滞',
    type: 'word',
    cefr: 'A2',
    pos: 'noun'
  },
  {
    english: 'rush hour',
    arabic: 'ساعة الذروة',
    french: 'heure de pointe',
    german: 'Berufsverkehr / Rushhour',
    spanish: 'hora punta',
    chinese: '高峰时段',
    japanese: 'ラッシュアワー',
    type: 'word',
    cefr: 'B1',
    pos: 'noun'
  },

  // ===================== WORK / SCHOOL / STUDY =====================
  {
    english: 'log in',
    arabic: 'تسجيل الدخول',
    french: 'se connecter',
    german: 'einloggen',
    spanish: 'iniciar sesión',
    chinese: '登录',
    japanese: 'ログインする',
    type: 'word',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'take notes',
    arabic: 'يدون الملاحظات',
    french: 'prendre des notes',
    german: 'Notizen machen',
    spanish: 'tomar notas',
    chinese: '做笔记',
    japanese: 'メモを取る',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'submit assignment',
    arabic: 'يسلم المهمة / التكليف',
    french: 'rendre un devoir',
    german: 'eine Hausarbeit abgeben',
    spanish: 'entregar una tarea',
    chinese: '提交作业',
    japanese: '課題を提出する',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'brainstorm',
    arabic: 'عصف ذهني',
    french: 'remue-méninges',
    german: 'Brainstorming machen',
    spanish: 'hacer una lluvia de ideas',
    chinese: '集思广益',
    japanese: 'ブレインストーミングをする',
    type: 'word',
    cefr: 'B2',
    pos: 'verb'
  },
  {
    english: 'do research',
    arabic: 'يقوم بالبحث',
    french: 'faire des recherches',
    german: 'recherchieren',
    spanish: 'investigar',
    chinese: '做研究',
    japanese: '調査する',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'study for exams',
    arabic: 'يدرس للامتحانات',
    french: 'réviser pour les examens',
    german: 'für Prüfungen lernen',
    spanish: 'estudiar para los exámenes',
    chinese: '准备考试',
    japanese: '試験勉強をする',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },

  // ===================== HOUSEHOLD CHORES =====================
  {
    english: 'sweep the floor',
    arabic: 'يكنس الأرض',
    french: 'balayer le sol',
    german: 'den Boden fegen',
    spanish: 'barrer el suelo',
    chinese: '扫地',
    japanese: '床を掃く',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'clean the windows',
    arabic: 'ينظف النوافذ',
    french: 'laver les vitres',
    german: 'die Fenster putzen',
    spanish: 'limpiar las ventanas',
    chinese: '擦窗户',
    japanese: '窓を掃除する',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'load the dishwasher',
    arabic: 'يملأ غسالة الأطباق',
    french: 'remplir le lave-vaisselle',
    german: 'die Spülmaschine einräumen',
    spanish: 'llenar el lavavajillas',
    chinese: '放进洗碗机',
    japanese: '食洗機に食器を入れる',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'empty the dishwasher',
    arabic: 'يفرغ غسالة الأطباق',
    french: 'vider le lave-vaisselle',
    german: 'die Spülmaschine ausräumen',
    spanish: 'vaciar el lavavajillas',
    chinese: '清空洗碗机',
    japanese: '食洗機から食器を出す',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'hang out the laundry',
    arabic: 'ينشر الغسيل',
    french: 'étendre le linge',
    german: 'Wäsche aufhängen',
    spanish: 'tender la ropa',
    chinese: '晾衣服',
    japanese: '洗濯物を干す',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'organize the closet',
    arabic: 'ينظم الخزانة',
    french: 'ranger le placard',
    german: 'den Schrank aufräumen',
    spanish: 'organizar el armario',
    chinese: '整理衣柜',
    japanese: 'クローゼットを整理する',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },

  // ===================== AFTERNOON & ERRANDS =====================
  {
    english: 'run errands',
    arabic: 'يقوم بمهام متنوعة',
    french: 'faire des courses / commissions',
    german: 'Besorgungen machen',
    spanish: 'hacer recados',
    chinese: '办杂事',
    japanese: '用事を済ませる',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'visit the pharmacy',
    arabic: 'يزور الصيدلية',
    french: 'aller à la pharmacie',
    german: 'zur Apotheke gehen',
    spanish: 'ir a la farmacia',
    chinese: '去药店',
    japanese: '薬局に行く',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'pick up kids',
    arabic: 'يصطحب الأطفال',
    french: 'chercher les enfants',
    german: 'die Kinder abholen',
    spanish: 'recoger a los niños',
    chinese: '接孩子',
    japanese: '子供を迎えに行く',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'afternoon nap',
    arabic: 'قيلولة بعد الظهر',
    french: 'sieste de l\'après-midi',
    german: 'Mittagsschlaf',
    spanish: 'siesta',
    chinese: '午睡',
    japanese: '昼寝',
    type: 'chunk',
    cefr: 'A2',
    pos: 'noun'
  },

  // ===================== WELLNESS & EVENING =====================
  {
    english: 'go for a run',
    arabic: 'يذهب للجري',
    french: 'aller courir',
    german: 'joggen gehen',
    spanish: 'salir a correr',
    chinese: '去跑步',
    japanese: 'ランニングに行く',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'practice yoga',
    arabic: 'يمارس اليوغا',
    french: 'faire du yoga',
    german: 'Yoga machen',
    spanish: 'practicar yoga',
    chinese: '练瑜伽',
    japanese: 'ヨガをする',
    type: 'chunk',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'journal',
    arabic: 'يدون اليوميات',
    french: 'écrire dans son journal',
    german: 'Tagebuch schreiben',
    spanish: 'escribir en el diario',
    chinese: '写日记',
    japanese: '日記を書く',
    type: 'word',
    cefr: 'B1',
    pos: 'verb'
  },
  {
    english: 'do skin care',
    arabic: 'يقوم بالعناية بالبشرة',
    french: 'faire ses soins de la peau',
    german: 'Hautpflege machen',
    spanish: 'hacer el cuidado de la piel',
    chinese: '护肤',
    japanese: 'スキンケアをする',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },
  {
    english: 'lock the door',
    arabic: 'يقفل الباب',
    french: 'fermer la porte à clé',
    german: 'die Tür abschließen',
    spanish: 'cerrar la puerta con llave',
    chinese: '锁门',
    japanese: 'ドアを施錠する',
    type: 'chunk',
    cefr: 'A1',
    pos: 'verb'
  },
  {
    english: 'set security alarm',
    arabic: 'يضبط إنذار الأمان',
    french: 'activer l\'alarme de sécurité',
    german: 'die Alarmanlage einschalten',
    spanish: 'poner la alarma de seguridad',
    chinese: '设置安保警报',
    japanese: '防犯アラームをセットする',
    type: 'chunk',
    cefr: 'B2',
    pos: 'verb'
  },
  {
    english: 'change into pajamas',
    arabic: 'يرتدي ملابس النوم',
    french: 'se mettre en pyjama',
    german: 'den Schlafanzug anziehen',
    spanish: 'ponerse el pijama',
    chinese: '换上睡衣',
    japanese: 'パジャマに着替える',
    type: 'chunk',
    cefr: 'A2',
    pos: 'verb'
  },

  // ===================== TIME & FREQUENCY =====================
  {
    english: 'every single day',
    arabic: 'كل يوم دون استثناء',
    french: 'chaque jour',
    german: 'jeden einzelnen Tag',
    spanish: 'todos los días sin falta',
    chinese: '每一天',
    japanese: '毎日欠かさず',
    type: 'chunk',
    cefr: 'A2',
    pos: 'adverb'
  },
  {
    english: 'once in a while',
    arabic: 'بين الحين والآخر',
    french: 'de temps en temps',
    german: 'hin und wieder',
    spanish: 'de vez en cuando',
    chinese: '偶尔',
    japanese: 'たまに',
    type: 'chunk',
    cefr: 'B1',
    pos: 'adverb'
  },
  {
    english: 'on a regular basis',
    arabic: 'بشكل منتظم',
    french: 'régulièrement',
    german: 'regelmäßig',
    spanish: 'de forma regular',
    chinese: '定期',
    japanese: '定期的に',
    type: 'chunk',
    cefr: 'B2',
    pos: 'adverb'
  },

  // ===================== EXPANDED SENTENCES =====================
  {
    english: 'I always make my bed as soon as I get up.',
    arabic: 'أرتب سريري دائمًا فور نهوضي.',
    french: 'Je fais toujours mon lit dès que je me lève.',
    german: 'Ich mache immer mein Bett, sobald ich aufstehe.',
    spanish: 'Siempre hago la cama en cuanto me levanto.',
    chinese: '我一早起就会整理床铺。',
    japanese: '私は起きるとすぐにいつもベッドメイキングをします。',
    type: 'sentence',
    cefr: 'A2'
  },
  {
    english: 'I try to drink a glass of water first thing in the morning.',
    arabic: 'أحاول شرب كوب من الماء أول شيء في الصباح.',
    french: 'J\'essaie de boire un verre d\'eau dès le réveil.',
    german: 'Ich versuche, morgens als Erstes ein Glas Wasser zu trinken.',
    spanish: 'Intento beber un vaso de agua nada más levantarme.',
    chinese: '我尝试早上起床第一件事就是喝杯水。',
    japanese: '私は朝一番にコップ一杯の水を飲むようにしています。',
    type: 'sentence',
    cefr: 'B1'
  },
  {
    english: 'The traffic was terrible during rush hour.',
    arabic: 'كانت حركة المرور مريعة خلال ساعة الذروة.',
    french: 'La circulation était terrible pendant l\'heure de pointe.',
    german: 'Der Verkehr war während der Rushhour schrecklich.',
    spanish: 'El tráfico era terrible durante la hora punta.',
    chinese: '高峰时段交通非常糟糕。',
    japanese: 'ラッシュアワーの渋滞はひどかったです。',
    type: 'sentence',
    cefr: 'B1'
  },
  {
    english: 'I usually check my emails while having coffee.',
    arabic: 'عادة ما أتفقد بريدي الإلكتروني أثناء شرب القهوة.',
    french: 'Je regarde généralement mes e-mails en prenant mon café.',
    german: 'Normalerweise checke ich meine E-Mails beim Kaffeetrinken.',
    spanish: 'Normalmente reviso mis correos mientras tomo café.',
    chinese: '我通常边喝咖啡边查邮件。',
    japanese: '私はたいていコーヒーを飲みながらメールをチェックします。',
    type: 'sentence',
    cefr: 'A2'
  },
  {
    english: 'I need to pick up some groceries on my way home.',
    arabic: 'أحتاج لشراء بعض البقالة في طريقي للمنزل.',
    french: 'Je dois acheter des courses en rentrant.',
    german: 'Ich muss auf dem Heimweg noch Lebensmittel einkaufen.',
    spanish: 'Tengo que comprar comida de camino a casa.',
    chinese: '我回家的路上需要买点菜。',
    japanese: '帰宅途中に食料品を買う必要があります。',
    type: 'sentence',
    cefr: 'A2'
  },
  {
    english: 'We have a family dinner at 7:30 PM.',
    arabic: 'نتناول عشاءً عائليًا في الساعة السابعة والنصف مساءً.',
    french: 'Nous dînons en famille à 19h30.',
    german: 'Um 19:30 Uhr essen wir gemeinsam mit der Familie zu Abend.',
    spanish: 'Cenamos en familia a las siete y media.',
    chinese: '我们晚上七点半全家一起吃晚饭。',
    japanese: '私たちは午後7時30分に家族で夕食を食べます。',
    type: 'sentence',
    cefr: 'A1'
  },
  {
    english: 'I like to meditate for ten minutes before sleeping.',
    arabic: 'أحب التأمل لمدة عشر دقائق قبل النوم.',
    french: 'J\'aime méditer pendant dix minutes avant de dormir.',
    german: 'Ich meditiere gerne zehn Minuten lang vor dem Schlafengehen.',
    spanish: 'Me gusta meditar diez minutos antes de dormir.',
    chinese: '我喜欢睡前冥想十分钟。',
    japanese: '私は寝る前に10分間瞑想するのが好きです。',
    type: 'sentence',
    cefr: 'B1'
  },
  {
    english: 'I set my alarm for 6:30 tomorrow morning.',
    arabic: 'ضبطت المنبه على الساعة السادسة والنصف صباح الغد.',
    french: 'J\'ai réglé mon réveil pour 6h30 demain matin.',
    german: 'Ich habe meinen Wecker für morgen früh um 6:30 Uhr gestellt.',
    spanish: 'He puesto la alarma para las 6:30 de mañana.',
    chinese: '我把明早的闹钟设在了六点半。',
    japanese: '明日の朝6時30分にアラームをセットしました。',
    type: 'sentence',
    cefr: 'A1'
  },
  {
    english: 'Could you please take out the trash?',
    arabic: 'هل يمكنك إخراج القمامة من فضلك؟',
    french: 'Pourrais-tu sortir la poubelle, s\'il te plaît ?',
    german: 'Könntest du bitte den Müll rausbringen?',
    spanish: '¿Podrías sacar la basura, por favor?',
    chinese: '请问你能把垃圾倒了吗？',
    japanese: 'ゴミを出してきていただけますか？',
    type: 'sentence',
    cefr: 'A1'
  },
  {
    english: 'Don\'t forget to lock the back door.',
    arabic: 'لا تنسَ قفل الباب الخلفي.',
    french: 'N\'oublie pas de fermer la porte arrière à clé.',
    german: 'Vergiss nicht, die Hintertür abzuschließen.',
    spanish: 'No te olvides de cerrar la puerta trasera con llave.',
    chinese: '别忘了锁后门。',
    japanese: '裏口の鍵を閉めるのを忘れないでください。',
    type: 'sentence',
    cefr: 'A2'
  }
];
