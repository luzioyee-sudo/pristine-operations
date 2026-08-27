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

export const INTRODUCING_YOURSELF_DATA: TopicItemRow[] = [
  { english: 'name', arabic: 'اسم', french: 'nom', german: 'Name', spanish: 'nombre', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'first name', arabic: 'الاسم الأول', french: 'prénom', german: 'Vorname', spanish: 'nombre de pila', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'last name / surname', arabic: 'اسم العائلة', french: 'nom de famille', german: 'Nachname', spanish: 'apellido', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'age', arabic: 'العمر', french: 'âge', german: 'Alter', spanish: 'edad', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'nationality', arabic: 'الجنسية', french: 'nationalité', german: 'Nationalität', spanish: 'nacionalidad', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'country', arabic: 'الدولة', french: 'pays', german: 'Land', spanish: 'país', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'city', arabic: 'المدينة', french: 'ville', german: 'Stadt', spanish: 'ciudad', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'hometown', arabic: 'مسقط الرأس', french: 'ville natale', german: 'Heimatstadt', spanish: 'ciudad natal', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'address', arabic: 'العنوان', french: 'adresse', german: 'Adresse', spanish: 'dirección', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'job / occupation', arabic: 'الوظيفة / المهنة', french: 'travail / emploi', german: 'Beruf', spanish: 'trabajo / ocupación', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'profession', arabic: 'المهنة', french: 'profession', german: 'Beruf', spanish: 'profesión', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'student', arabic: 'طالب', french: 'étudiant(e)', german: 'Student(in)', spanish: 'estudiante', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'worker / employee', arabic: 'عامل / موظف', french: 'employé(e)', german: 'Angestellte(r)', spanish: 'empleado/a', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'manager', arabic: 'مدير', french: 'directeur/directrice', german: 'Manager(in)', spanish: 'gerente', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'teacher', arabic: 'معلم', french: 'professeur / enseignant(e)', german: 'Lehrer(in)', spanish: 'profesor/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'engineer', arabic: 'مهندس', french: 'ingénieur(e)', german: 'Ingenieur(in)', spanish: 'ingeniero/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'doctor', arabic: 'طبيب', french: 'médecin', german: 'Arzt/Ärztin', spanish: 'médico/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'nurse', arabic: 'ممرضة', french: 'infirmier/infirmière', german: 'Krankenpfleger/-schwester', spanish: 'enfermero/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'driver', arabic: 'سائق', french: 'chauffeur/chauffeuse', german: 'Fahrer(in)', spanish: 'conductor/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'farmer', arabic: 'مزارع', french: 'agriculteur/agricultrice', german: 'Bauer/Bäuerin', spanish: 'agricultor/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'married', arabic: 'متزوج', french: 'marié(e)', german: 'verheiratet', spanish: 'casado/a', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'single', arabic: 'أعزب', french: 'célibataire', german: 'ledig', spanish: 'soltero/a', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'divorced', arabic: 'مطلق', french: 'divorcé(e)', german: 'geschieden', spanish: 'divorciado/a', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'hobby', arabic: 'هواية', french: 'passe-temps', german: 'Hobby', spanish: 'pasatiempo', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'interest', arabic: 'اهتمام', french: 'intérêt', german: 'Interesse', spanish: 'interés', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'language', arabic: 'لغة', french: 'langue', german: 'Sprache', spanish: 'idioma', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'speak', arabic: 'يتحدث', french: 'parler', german: 'sprechen', spanish: 'hablar', type: 'word', cefr: 'A1', pos: 'verb' },
  { english: 'understand', arabic: 'يفهم', french: 'comprendre', german: 'verstehen', spanish: 'entender', type: 'word', cefr: 'A1', pos: 'verb' },
  { english: 'mother tongue', arabic: 'اللغة الأم', french: 'langue maternelle', german: 'Muttersprache', spanish: 'lengua materna', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'phone number', arabic: 'رقم الهاتف', french: 'numéro de téléphone', german: 'Telefonnummer', spanish: 'número de téléphone', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'email address', arabic: 'البريد الإلكتروني', french: 'adresse e-mail', german: 'E-Mail-Adresse', spanish: 'correo electrónico', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'meet', arabic: 'يقابل', french: 'rencontrer', german: 'treffen', spanish: 'conocer / encontrarse', type: 'word', cefr: 'A1', pos: 'verb' },
  { english: 'introduce', arabic: 'يقدم / يعرّف', french: 'présenter', german: 'vorstellen', spanish: 'presentar', type: 'word', cefr: 'A1', pos: 'verb' },
  { english: 'colleague', arabic: 'زميل عمل', french: 'collègue', german: 'Kollege/Kollegin', spanish: 'colega', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'neighbor', arabic: 'جار', french: 'voisin(e)', german: 'Nachbar(in)', spanish: 'vecino/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'friend', arabic: 'صديق', french: 'ami(e)', german: 'Freund(in)', spanish: 'amigo/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'adult', arabic: 'بالغ', french: 'adulte', german: 'Erwachsene(r)', spanish: 'adulto/a', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'child / children', arabic: 'طفل / أطفال', french: 'enfant / enfants', german: 'Kind/Kinder', spanish: 'niño/a / niños', type: 'chunk', cefr: 'A1', pos: 'noun' },
  { english: 'teenager', arabic: 'مراهق', french: 'adolescent(e)', german: 'Teenager/Jugendliche(r)', spanish: 'adolescente', type: 'word', cefr: 'A1', pos: 'noun' },
  { english: 'young', arabic: 'صغير السن', french: 'jeune', german: 'jung', spanish: 'joven', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'old', arabic: 'كبير السن', french: 'vieux/vieille', german: 'alt', spanish: 'viejo/a', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'tall', arabic: 'طويل', french: 'grand(e)', german: 'groß', spanish: 'alto/a', type: 'word', cefr: 'A1', pos: 'adjective' },
  { english: 'short', arabic: 'قصير', french: 'petit(e)', german: 'klein', spanish: 'bajo/a', type: 'word', cefr: 'A1', pos: 'adjective' },

  // Sentences & Phrases
  { english: 'My name is Omar.', arabic: 'اسمي عمر.', french: 'Je m\'appelle Omar.', german: 'Ich heiße Omar.', spanish: 'Me llamo Omar.', type: 'sentence', cefr: 'A1' },
  { english: 'My first name is Ali.', arabic: 'اسمي الأول علي.', french: 'Mon prénom est Ali.', german: 'Mein Vorname ist Ali.', spanish: 'Mi nombre de pila es Ali.', type: 'sentence', cefr: 'A1' },
  { english: 'My last name is Hassan.', arabic: 'اسم عائلتي حسن.', french: 'Mon nom de famille est Hassan.', german: 'Mein Nachname ist Hassan.', spanish: 'Mi apellido es Hassan.', type: 'sentence', cefr: 'A1' },
  { english: 'My age is twenty-two.', arabic: 'عمري اثنان وعشرون عامًا.', french: 'J\'ai vingt-deux ans.', german: 'Ich bin zweiundzwanzig Jahre alt.', spanish: 'Tengo veintidós años.', type: 'sentence', cefr: 'A1' },
  { english: 'My nationality is Egyptian.', arabic: 'جنسيتي مصرية.', french: 'Ma nationalité est égyptienne.', german: 'Meine Nationalität ist ägyptisch.', spanish: 'Mi nacionalidad es egipcia.', type: 'sentence', cefr: 'A1' },
  { english: 'I am from a beautiful country.', arabic: 'أنا من بلد جميل.', french: 'Je viens d\'un beau pays.', german: 'Ich komme aus einem schönen Land.', spanish: 'Vengo de un país hermoso.', type: 'sentence', cefr: 'A1' },
  { english: 'I was born in this city.', arabic: 'وُلدت في هذه المدينة.', french: 'Je suis né(e) dans cette ville.', german: 'Ich wurde in dieser Stadt geboren.', spanish: 'Nací en esta ciudad.', type: 'sentence', cefr: 'A1' },
  { english: 'My hometown is Luxor.', arabic: 'مسقط رأسي الأقصر.', french: 'Ma ville natale est Louxor.', german: 'Meine Heimatstadt ist Luxor.', spanish: 'Mi ciudad natal es Luxor.', type: 'sentence', cefr: 'A1' },
  { english: 'Can you give me your address?', arabic: 'هل يمكنك إعطائي عنوانك؟', french: 'Peux-tu me donner ton adresse ?', german: 'Kann du mir deine Adresse geben?', spanish: '¿Puedes darme tu dirección?', type: 'sentence', cefr: 'A1' },
  { english: 'What is your occupation?', arabic: 'ما هي مهنتك؟', french: 'Quelle est ta profession ?', german: 'Was ist dein Beruf?', spanish: '¿Cuál es tu ocupación?', type: 'sentence', cefr: 'A1' },
  { english: 'Teaching is a respected profession.', arabic: 'التدريس مهنة محترمة.', french: 'L\'enseignement est une profession respectée.', german: 'Unterrichten ist ein angesehener Beruf.', spanish: 'La enseñanza es una profesión respetada.', type: 'sentence', cefr: 'A2' },
  { english: 'I am a university student.', arabic: 'أنا طالب جامعي.', french: 'Je suis étudiant(e) à l\'université.', german: 'Ich bin Student(in) an der Universität.', spanish: 'Soy estudiante universitario/a.', type: 'sentence', cefr: 'A1' },
  { english: 'He is an employee at a bank.', arabic: 'هو موظف في بنك.', french: 'Il est employé dans une banque.', german: 'Er ist Angestellter bei einer Bank.', spanish: 'Él es empleado de un banco.', type: 'sentence', cefr: 'A2' },
  { english: 'She is the manager of the store.', arabic: 'هي مديرة المتجر.', french: 'Elle est la directrice du magasin.', german: 'Sie ist die Managerin des Geschäfts.', spanish: 'Ella es la gerente de la tienda.', type: 'sentence', cefr: 'A2' },
  { english: 'My teacher is very kind.', arabic: 'معلمي لطيف جدًا.', french: 'Mon professeur est très gentil.', german: 'Mein Lehrer ist sehr nett.', spanish: 'Mi profesor es muy amable.', type: 'sentence', cefr: 'A1' },
  { english: 'My brother is an engineer.', arabic: 'أخي مهندس.', french: 'Mon frère est ingénieur.', german: 'Mein Bruder ist Ingenieur.', spanish: 'Mi hermano es ingeniero.', type: 'sentence', cefr: 'A2' },
  { english: 'She wants to be a doctor.', arabic: 'تريد أن تصبح طبيبة.', french: 'Elle veut devenir médecin.', german: 'Sie möchte Ärztin werden.', spanish: 'Ella quiere ser médica.', type: 'sentence', cefr: 'A1' },
  { english: 'The nurse was very helpful.', arabic: 'كانت الممرضة متعاونة جدًا.', french: 'L\'infirmière a été très serviable.', german: 'Die Krankenschwester war sehr hilfsbereit.', spanish: 'La enfermera fue muy servicial.', type: 'sentence', cefr: 'A2' },
  { english: 'He works as a taxi driver.', arabic: 'يعمل كسائق تاكسي.', french: 'Il travaille comme chauffeur de taxi.', german: 'Er arbeitet als Taxifahrer.', spanish: 'Él trabaja como taxista.', type: 'sentence', cefr: 'A2' },
  { english: 'My grandfather was a farmer.', arabic: 'كان جدي مزارعًا.', french: 'Mon grand-père était agriculteur.', german: 'Mein Großvater war Bauer.', spanish: 'Mi abuelo era agricultor.', type: 'sentence', cefr: 'A2' },
  { english: 'My sister is married.', arabic: 'أختي متزوجة.', french: 'Ma sœur est mariée.', german: 'Meine Schwester ist verheiratet.', spanish: 'Mi hermana está casada.', type: 'sentence', cefr: 'A1' },
  { english: 'I am still single.', arabic: 'ما زلت أعزب.', french: 'Je suis encore célibataire.', german: 'Ich bin noch ledig.', spanish: 'Todavía estoy soltero/a.', type: 'sentence', cefr: 'A1' },
  { english: 'He got divorced last year.', arabic: 'تطلق العام الماضي.', french: 'Il a divorcé l\'année dernière.', german: 'Er hat sich letztes Jahr scheiden lassen.', spanish: 'Se divorció el año pasado.', type: 'sentence', cefr: 'A2' },
  { english: 'Football is my hobby.', arabic: 'كرة القدم هي هوايتي.', french: 'Le football est mon passe-temps.', german: 'Fußball ist mein Hobby.', spanish: 'El fútbol es mi pasatiempo.', type: 'sentence', cefr: 'A1' },
  { english: 'My interests include music and travel.', arabic: 'تشمل اهتماماتي الموسيقى والسفر.', french: 'Mes centres d\'intérêt incluent la musique et les voyages.', german: 'Zu meinen Interessen gehören Musik und Reisen.', spanish: 'Mis intereses incluyen la música y los viajes.', type: 'sentence', cefr: 'A2' },
  { english: 'English is a global language.', arabic: 'الإنجليزية لغة عالمية.', french: 'L\'anglais est une langue mondiale.', german: 'Englisch ist eine Weltsprache.', spanish: 'El inglés es un idioma global.', type: 'sentence', cefr: 'A1' },
  { english: 'I speak Arabic and English.', arabic: 'أتحدث العربية والإنجليزية.', french: 'Je parle arabe et anglais.', german: 'Ich spreche Arabisch und Englisch.', spanish: 'Hablo árabe e inglés.', type: 'sentence', cefr: 'A1' },
  { english: 'I understand a little French.', arabic: 'أفهم القليل من الفرنسية.', french: 'Je comprends un peu le français.', german: 'Ich verstehe ein wenig Französisch.', spanish: 'Entiendo un poco de francés.', type: 'sentence', cefr: 'A1' },
  { english: 'Arabic is my mother tongue.', arabic: 'العربية هي لغتي الأم.', french: 'L\'ارابة est ma langue maternelle.', german: 'Arabisch ist meine Muttersprache.', spanish: 'El árabe es mi lengua materna.', type: 'sentence', cefr: 'A2' },
  { english: 'Can I have your phone number?', arabic: 'هل يمكنني الحصول على رقم هاتفك؟', french: 'Puis-je avoir ton numéro de téléphone ?', german: 'Kann ich deine Telefonnummer haben?', spanish: '¿Puedo tener tu número de teléfono?', type: 'sentence', cefr: 'A1' },
  { english: 'Please send me your email address.', arabic: 'من فضلك أرسل لي بريدك الإلكتروني.', french: 'Envoie-moi ton adresse e-mail, s\'il te plaît.', german: 'Bitte schick mir deine E-Mail-Adresse.', spanish: 'Por favor, envíame tu correo electrónico.', type: 'sentence', cefr: 'A1' },
  { english: 'I met him yesterday.', arabic: 'قابلته أمس.', french: 'Je l\'ai rencontré hier.', german: 'Ich habe ihn gestern getroffen.', spanish: 'Lo conocí ayer.', type: 'sentence', cefr: 'A1' },
  { english: 'Let me introduce myself.', arabic: 'دعني أقدم نفسي.', french: 'Laisse-moi me présenter.', german: 'Lass mich mich vorstellen.', spanish: 'Déjame presentarme.', type: 'sentence', cefr: 'A1' },
  { english: 'He is my colleague at work.', arabic: 'هو زميلي في العمل.', french: 'C\'est mon collègue de travail.', german: 'Er ist mein Kollege bei der Arbeit.', spanish: 'Él es mi colega de trabajo.', type: 'sentence', cefr: 'A2' },
  { english: 'My neighbor is very friendly.', arabic: 'جاري ودود جدًا.', french: 'Mon voisin est très amical.', german: 'Mein Nachbar ist sehr freundlich.', spanish: 'Mi vecino es muy amable.', type: 'sentence', cefr: 'A1' },
  { english: 'She is my best friend.', arabic: 'هي صديقتي المفضلة.', french: 'C\'est ma meilleure amie.', german: 'Sie ist meine beste Freundin.', spanish: 'Ella es mi mejor amiga.', type: 'sentence', cefr: 'A1' },
  { english: 'This film is for adults only.', arabic: 'هذا الفيلم للبالغين فقط.', french: 'Ce film est réservé aux adultes.', german: 'Dieser Film ist nur für Erwachsene.', spanish: 'Esta película es solo para adultos.', type: 'sentence', cefr: 'A2' },
  { english: 'She has two children.', arabic: 'لديها طفلان.', french: 'Elle a deux enfants.', german: 'Sie hat zwei Kinder.', spanish: 'Ella tiene dos hijos.', type: 'sentence', cefr: 'A1' },
  { english: 'My son is a teenager now.', arabic: 'ابني مراهق الآن.', french: 'Mon fils est adolescent maintenant.', german: 'Mein Sohn ist jetzt ein Teenager.', spanish: 'Mi hijo ya es adolescente.', type: 'sentence', cefr: 'A2' },
  { english: 'He looks very young.', arabic: 'يبدو صغيرًا جدًا.', french: 'Il a l\'air très jeune.', german: 'Er sieht sehr jung aus.', spanish: 'Se ve muy joven.', type: 'sentence', cefr: 'A1' },
  { english: 'My grandfather is very old.', arabic: 'جدي كبير في السن جدًا.', french: 'Mon grand-père est très vieux.', german: 'Mein Großvater ist sehr alt.', spanish: 'Mi abuelo es muy viejo.', type: 'sentence', cefr: 'A1' },
  { english: 'He is tall and thin.', arabic: 'هو طويل ونحيف.', french: 'Il est grand et mince.', german: 'Er ist groß und schlank.', spanish: 'Él es alto y delgado.', type: 'sentence', cefr: 'A1' },
  { english: 'She is short and friendly.', arabic: 'هي قصيرة وودودة.', french: 'Elle est petite et amicale.', german: 'Sie ist klein und freundlich.', spanish: 'Ella es baja y amable.', type: 'sentence', cefr: 'A1' },

  // Chunk/Conversational starters
  { english: 'My name is...', arabic: 'اسمي هو...', french: 'Je m\'appelle...', german: 'Ich heiße...', spanish: 'Me llamo...', type: 'chunk', cefr: 'A1' },
  { english: 'I am ... years old', arabic: 'عمري ... سنة', french: 'J\'ai ... ans', german: 'Ich bin ... Jahre alt', spanish: 'Tengo ... años', type: 'chunk', cefr: 'A1' },
  { english: 'I come from...', arabic: 'أنا من...', french: 'Je viens de...', german: 'Ich komme aus...', spanish: 'Vengo de...', type: 'chunk', cefr: 'A1' },
  { english: 'I live in...', arabic: 'أعيش في...', french: 'J\'habite à...', german: 'Ich wohne in...', spanish: 'Vivo en...', type: 'chunk', cefr: 'A1' },
  { english: 'I work as a...', arabic: 'أعمل كـ...', french: 'Je travaille comme...', german: 'Ich travaille comme...', spanish: 'Trabajo como...', type: 'chunk', cefr: 'A1' },
  { english: 'Nice to meet you', arabic: 'سعيد بلقائك', french: 'Enchanté(e)', german: 'Freut mich, dich kennenzulernen', spanish: 'Mucho gusto', type: 'chunk', cefr: 'A1' },
  { english: 'What\'s your name?', arabic: 'ما اسمك؟', french: 'Comment tu t\'appelles ?', german: 'Wie heißt du?', spanish: '¿Cómo te llamas?', type: 'chunk', cefr: 'A1' },
  { english: 'Where are you from?', arabic: 'من أين أنت؟', french: 'D\'où viens-tu ?', german: 'Woher kommst du?', spanish: '¿De dónde eres?', type: 'chunk', cefr: 'A1' },
  { english: 'How old are you?', arabic: 'كم عمرك؟', french: 'Quel âge as-tu ?', german: 'Wie alt bist du?', spanish: '¿Cuántos años tienes?', type: 'chunk', cefr: 'A1' },
  { english: 'What do you do?', arabic: 'ماذا تعمل؟', french: 'Qu\'est-ce que tu fais dans la vie ?', german: 'Was machst du beruflich?', spanish: '¿A qué te dedicicas?', type: 'chunk', cefr: 'A1' },
  { english: 'I\'m new here', arabic: 'أنا جديد هنا', french: 'Je suis nouveau/nouvelle ici', german: 'Ich bin neu hier', spanish: 'Soy nuevo/a aquí', type: 'chunk', cefr: 'A1' },
  { english: 'Let me introduce myself', arabic: 'دعني أُقَدِّم نفسي', french: 'Laisse-moi me présenter', german: 'Lass mich mich vorstellen', spanish: 'Déجame presentarme', type: 'chunk', cefr: 'A1' },
  { english: 'Can you spell that, please?', arabic: 'هل يمكنك تهجئتها من فضلك؟', french: 'Peux-tu épeler ça, s\'il te plaît ?', german: 'Kannst du das bitte buchstabieren?', spanish: '¿Puedes deletrearlo, por favor?', type: 'chunk', cefr: 'A1' },
  { english: 'I\'m from Egypt originally', arabic: 'أنا من مصر أصلاً', french: 'Je suis originaire d\'Égypte', german: 'Ich komme ursprünglich aus Ägypten', spanish: 'Soy originario/a de Egipto', type: 'chunk', cefr: 'A1' },
  { english: 'What do you do in your free time?', arabic: 'ماذا تفعل في وقت فراغك؟', french: 'Que fais-tu pendant ton temps libre ?', german: 'Was machst du in deiner Freizeit?', spanish: '¿Qué haces en tu tiempo libre?', type: 'chunk', cefr: 'A1' }
];
