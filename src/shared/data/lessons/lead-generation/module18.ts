import { Lesson } from '@/entities/lesson';

export const module18Lessons: Lesson[] = [
  {
    id: '18-1-linkedin-sales-navigator-boolean-search',
    slug: '18-1-linkedin-sales-navigator-boolean-search',
    courseSlug: 'lead-generation',
    moduleId: 18,
    moduleTitle: 'Модуль 2: Стек скрапинга, обогащения и валидации контактов',
    lessonNumber: '2.1',
    title: 'LinkedIn Sales Navigator: продвинутый Boolean Search, Account Lists и фильтры смены работы',
    level: 'Middle',
    readTimeMinutes: 10,
    targetAudience: 'SDRs, Lead Generation Specialists, B2B Researchers',
    summary:
      'Профессиональная работа с LinkedIn Sales Navigator. Синтаксис логических операторов Boolean Search (AND, OR, NOT, кавычки, круглые скобки). Построение списков целевых аккаунтов (Account Lists), мониторинг смены работы («Changed jobs in past 90 days») и выгрузка ID профилей через расширения.',
    competencies: ['PMM & Positioning', 'Enterprise Performance'],
    coreConcepts: [
      {
        title: 'Boolean Search Logic в Sales Navigator',
        explanation:
          'Формулы точного отсева лишних должностей в строке поиска по титулам (например: ("VP" OR "Vice President" OR "Head") AND "Sales" NOT ("Assistant" OR "Junior" OR "Intern")).',
      },
      {
        title: 'Changed Jobs Filter (Бывшие клиенты на новом месте)',
        explanation:
          'Фильтр поиска людей, которые пользовались вашим продуктом на предыдущей работе и перешли в новую компанию за последние 90 дней (самый горячий B2B лид с конверсией >40%).',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Lead Scraping Accuracy (Чистота выборки)',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 95% строго соответствуют ICP',
        dangerZone: '< 80% (мусорные тайтлы в выборке приводят к неловким холодным письмам)',
        calculation: 'Валидные профили / Всего выгруженных строк',
        seniorContext:
          'Если в выборку "Head of Engineering" случайно попал "Sales Engineer", конверсия цепочки обрушится из-за несоответствия болей.',
      },
    ],
    researchInsights: [
      {
        source: 'UserGems & LinkedIn B2B Benchmark Study',
        year: '2023',
        finding:
          'Бывшие пользователи продукта при переходе в новую компанию в 3.8 раза охотнее соглашаются на демо по сравнению со стандартным холодным аутричем.',
        practicalTakeaway:
          'Создайте в Sales Navigator постоянный сохраненный поиск (Saved Search) по бывшим клиентам и настройте еженедельный алерт о смене мест работы.',
      },
    ],
    interviewCases: [
      {
        question:
          'Напишите точный поисковый запрос Boolean Search в LinkedIn Sales Navigator для поиска руководителей маркетинга B2B SaaS компаний в США, исключая агентства, интернов и фрилансеров.',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Идеальное знание синтаксиса, вложенности скобок, правильного использования оператора NOT.',
        antiPatternAnswer: '«Наберу просто Marketing Director в поиске».',
        seniorBattleTestedAnswer:
          '«В поле Title я пропишу: ("Chief Marketing Officer" OR "CMO" OR "VP of Marketing" OR "Vice President Marketing" OR "Head of Marketing" OR "Director of Marketing") AND ("B2B" OR "SaaS" OR "Software") NOT ("Agency" OR "Freelance" OR "Consultant" OR "Assistant" OR "Intern" OR "Coordinator" OR "Specialist"). В фильтрах аккаунтов установлю: Industry: Software Development / IT Services; Company Headcount: 50-500; Geography: United States; Exclude: Marketing Services / Advertising Services».',
        probingQuestions: [
          'Как обойти ограничение Sales Navigator на выгрузку максимум 2,500 лидов в поиске?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Собрал и верифицировал базу из [X] целевых контактов, обеспечив [Y]% чистоты',
        template:
          'Построил систему сбора лидов через LinkedIn Sales Navigator и Boolean фильтры, сформировав базу из {X} верифицированных ЛПР с точностью соответствия ICP >{Y}%.',
        concreteExample:
          'Сформировал пайплайн сбора ЛПР через Sales Navigator и кастомные Boolean скрипты, выгрузив 12,000+ целевых контактов с чистотой выборки 96% и сократив время ресерча на 60%.',
        keywords: ['LinkedIn Sales Navigator', 'Boolean Search', 'Account Lists', 'Lead Scraping', 'SDR Research'],
      },
    ],
    quizQuestions: [
      {
        id: '18-1-q1',
        question: 'Что вернет поисковый запрос ("Head of Sales" OR "VP Sales") AND "Enterprise" NOT "Junior" в Sales Navigator?',
        options: [
          'Всех сотрудников отдела продаж',
          'Только руководителей продаж уровня Head/VP с опытом в Enterprise, исключая любые профили со словом Junior',
          'Только джуниор-менеджеров',
          'Ошибку синтаксиса',
        ],
        correctOptionIndex: 1,
        explanation: 'Оператор AND сужает выборку до обязательного наличия Enterprise, а NOT отсекает нецелевых младших сотрудников.',
        commonMistake: 'Забывают кавычки для многословных фраз, из-за чего LinkedIn ищет слова по отдельности.',
      },
    ],
    longreadMarkdown: `
### Шпаргалка синтаксиса Boolean Search для SDR

\`\`\`
1. Кавычки " ": ищут точную фразу целиком.
   Пример: "Head of Growth" (а не просто Head и Growth в разных местах).

2. OR: объединяет синонимы (хотя бы одно условие).
   Пример: "CMO" OR "Chief Marketing Officer" OR "VP Marketing"

3. AND: обязательное пересечение обоих условий.
   Пример: "VP of Sales" AND "Fintech"

4. NOT: исключает нецелевые совпадения.
   Пример: "Marketing" NOT ("Agency" OR "Consulting")

5. Скобки ( ): группируют приоритет логических операторов.
\`\`\`
    `,
  },
  {
    id: '18-2-clay-apollo-waterfall-enrichment-automation',
    slug: '18-2-clay-apollo-waterfall-enrichment-automation',
    courseSlug: 'lead-generation',
    moduleId: 18,
    moduleTitle: 'Модуль 2: Стек скрапинга, обогащения и валидации контактов',
    lessonNumber: '2.2',
    title: 'Автоматизация обогащения в Clay и Apollo.io: концепция Waterfall Enrichment',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'SDR Leads, Growth Engineers, Revenue Operations (RevOps)',
    summary:
      'Почему использование одного источника обогащения (например, только Apollo или Hunter) дает не более 45-55% найденных email. Методология водопадного обогащения (Waterfall Enrichment) в Clay: последовательный опрос 5+ баз данных до нахождения валидного рабочего email и верифицированного мобильного номера.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Waterfall Enrichment (Водопадное обогащение)',
        explanation:
          'Алгоритмический каскад: сначала опрашивается самый дешевый провайдер (например, Apollo), если email не найден или статус «risky» — запрос автоматически идет во второй (Dropcontact), затем в третий (Prospeo), четвертый (Findymail) и пятый (Enrow). Результат: нахождение до 85-92% валидных контактов.',
      },
      {
        title: 'Clay Automation & AI Enrichment',
        explanation:
          'Табличная платформа интеграции API для RevOps: автоматический скрапинг сайтов компаний, саммаризация кейсов через LLM, классификация B2B/B2C и генерация персонализированных переменных.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Waterfall Match Rate',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 80% - 90% найденных валидных рабочих email',
        dangerZone: '< 50% (использование только одной изолированной базы данных)',
        calculation: 'Найденные валидные контакты / Всего переданных строк',
        seniorContext:
          'Переход на Waterfall обогащение удваивает полезную емкость одной и той же базы без затрат времени на ручной ресерч.',
      },
    ],
    researchInsights: [
      {
        source: 'Clay & Modern Outbound Stack Benchmark',
        year: '2023',
        finding:
          'Одиночный провайдер данных (ZoomInfo или Apollo) в среднем имеет актуальные валидные почты лишь для 48% контактов в Европе и 62% в США. Каскадный Waterfall из 4 провайдеров поднимает покрытие до 89%.',
        practicalTakeaway:
          'Настройте в Clay каскад: Apollo &rarr; Prospeo &rarr; Dropcontact &rarr; Datagma для максимального охвата при минимальной средней стоимости лида.',
      },
    ],
    interviewCases: [
      {
        question:
          'У вас есть список из 5,000 LinkedIn URL целевых ЛПР, но бюджет на обогащение строго ограничен ($150 в месяц). Как построить водопад в Clay для максимального покрытия?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание стоимости вызовов API провайдеров, оптимизация затрат через дешевые базы в начале водопада и дорогие только в случае неудачи.',
        antiPatternAnswer: '«Просто куплю самый дорогой тариф ZoomInfo за $15,000».',
        seniorBattleTestedAnswer:
          '«В Clay я выстрою каскад от дешевого к дорогому с жестким условием остановки (Conditional Run): 1) Сначала опрашиваем внутреннюю базу Apollo (дешево, $0.01 за контакт); если статус «Valid» — водопад останавливается; 2) Если email не найден или «Catch-all», запускаем Prospeo ($0.03); 3) Для оставшихся ненайденных 20% запускаем специализированный скрапер Dropcontact ($0.04); 4) Валидируем через NeverBounce/ReBounce только те почты, которые были под сомнением. Такая архитектура укладывается в бюджет $120-$140 и дает ~85% итогового покрытия базы».',
        probingQuestions: [
          'Как Clay генерирует персонализированные предложения на базе 10-K отчетов компаний?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Внедрил Waterfall обогащение в Clay, подняв процент найденных контактов с [X]% до [Y]%',
        template:
          'Спроектировал каскадную систему обогащения (Waterfall Enrichment) в Clay на базе {X} провайдеров, подняв Valid Email Match Rate с {X}% до {Y}% и сократив стоимость за лид на {Z}%.',
        concreteExample:
          'Построил автоматизированный конвейер обогащения в Clay с каскадом Apollo &rarr; Prospeo &rarr; Datagma, увеличив долю найденных ЛПР с 51% до 88% и сэкономив $2,400 ежемесячных затрат на RevOps софт.',
        keywords: ['Clay', 'Apollo.io', 'Waterfall Enrichment', 'RevOps Automation', 'Match Rate'],
      },
    ],
    quizQuestions: [
      {
        id: '18-2-q1',
        question: 'В чем ключевое финансовое и операционное преимущество концепции Waterfall Enrichment?',
        options: [
          'Она делает бесплатными звонки за границу',
          'Она опрашивает базы каскадно (от дешевых к дорогим) и останавливается при первом валидном результате, максимизируя покрытие при минимальной стоимости',
          'Она гарантирует 100% ответ на холодные письма',
          'Она заменяет работу менеджера по продажам',
        ],
        correctOptionIndex: 1,
        explanation: 'Waterfall не платит всем провайдерам одновременно, а обращается к следующей базе только в том случае, если предыдущая не нашла контакт.',
        commonMistake: 'Считают, что Waterfall отправляет параллельные платные запросы во все базы одновременно, завышая косты.',
      },
    ],
    longreadMarkdown: `
### Архитектура Waterfall каскада в Clay

\`\`\`
[Вход: LinkedIn Profile URL]
         │
         ▼
[Шаг 1: Apollo.io API ($0.01)] 
         ├── Найден валидный email? -> ДА -> [Успех: Выход]
         │
         └── НЕТ / Catch-all
                  │
                  ▼
         [Шаг 2: Prospeo API ($0.03)]
                  ├── Найден валидный email? -> ДА -> [Успех: Выход]
                  │
                  └── НЕТ
                           │
                           ▼
                  [Шаг 3: Dropcontact API ($0.04)]
                           ├── Найден email? -> ДА -> [Успех: Выход]
                           │
                           └── НЕТ -> [Флаг: Только телефон или LinkedIn InMail]
\`\`\`
    `,
  },
  {
    id: '18-3-email-phone-validation-zerobounce-waterfall',
    slug: '18-3-email-phone-validation-zerobounce-waterfall',
    courseSlug: 'lead-generation',
    moduleId: 18,
    moduleTitle: 'Модуль 2: Стек скрапинга, обогащения и валидации контактов',
    lessonNumber: '2.3',
    title: 'Валидация email и мобильных телефонов: ZeroBounce, NeverBounce, спам-ловушки и Catch-All почты',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'SDRs, Outbound Engineers, RevOps Specialists',
    summary:
      'Как защитить домены от блокировок Google/Microsoft через пре-валидацию баз. Глубокий разбор SMTP handshake, проверка MX записей, детекция спам-ловушек (Spam Traps) и риск отправки на Catch-All (Accept-All) почтовые серверы.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Catch-All (Accept-All) Mail Servers',
        explanation:
          'Настройка корпоративного почтового сервера (например, в крупных банках), при которой сервер принимает ЛЮБЫЕ входящие письма на домен без ошибки 550, но затем фильтрует их внутри или тихо отбрасывает. Стандартные валидаторы не могут гарантировать доставку на такие адреса.',
      },
      {
        title: 'Spam Traps (Спам-ловушки)',
        explanation:
          'Заброшенные или специально созданные почтовые адреса антиспам-организаций (Spamhaus). Одно попадание письма в спам-ловушку приводит к мгновенному бану домена во всех мировых почтовых провайдерах.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Hard Bounce Rate Benchmark',
        industry: 'B2B SaaS',
        targetBenchmark: '< 1.5% - 2.0% от объема отправки',
        dangerZone: '> 3.5% (мгновенный триггер бана от Google Workspace / Outlook)',
        calculation: 'Недоставленные письма (Bounce 550) / Всего отправленных писем',
        seniorContext:
          'Если Bounce Rate кампании превышает 4%, алгоритмы Gmail и Microsoft отправляют 100% последующих писем в папку «Спам» независимо от их содержания.',
      },
    ],
    researchInsights: [
      {
        source: 'Return Path & ZeroBounce Deliverability Benchmark',
        year: '2023',
        finding:
          'В B2B сегменте до 28% корпоративных email-адресов устаревают ежегодно из-за текучести кадров. Отправка по базам трехмесячной давности без валидации гарантирует всплеск Bounce Rate выше 6%.',
        practicalTakeaway:
          'Всегда валидируйте базу день-в-день перед загрузкой в Smartlead/Instantly.',
      },
    ],
    interviewCases: [
      {
        question:
          'Валидатор вернул результат: 40% базы помечены как «Catch-All / Risky». Отправлять на них или удалять? Как верифицировать Catch-All без риска для домена?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание работы Catch-all серверов, использование специализированных верификаторов (Scrubby / Enrow), тактика постепенного подмешивания малых доз.',
        antiPatternAnswer: '«Либо удалю все 40%, либо отправлю все сразу на удачу».',
        seniorBattleTestedAnswer:
          '«Удалять 40% базы — это потеря огромной части целевых enterprise-компаний, так как почти все Fortune 500 используют catch-all серверы. Мое решение: 1) Использую глубокий верификатор Catch-all почт (например, Scrubby или Enrow), который валидирует доставку через реальную отправку безопасных пингов с одноразовых доменов; 2) Оставшиеся условно-валидные catch-all адреса отправляю на отдельный изолированный пул прогретых второстепенных доменов; 3) Подмешиваю catch-all малыми порциями (не более 5-10% от суточного объема ящика) на фоне 90% строго валидных адресов, чтобы удерживать совокупный Hard Bounce строго ниже 2%».',
        probingQuestions: [
          'Как ZeroBounce идентифицирует Spam Traps?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил Bounce Rate до [X]%, внедрив протокол валидации [Y]',
        template:
          'Внедрил автоматический конвейер предварительной очистки баз через ZeroBounce и алгоритмы обработки Catch-All почт, снизив Hard Bounce до {X}% и сохранив {Y} доменов от банов.',
        concreteExample:
          'Разработал протокол верификации баз перед рассылкой 45,000+ контактов в месяц, снизив средний Bounce Rate с 5.2% до 1.1% и обеспечив 98%+ доставляемость во входящие.',
        keywords: ['ZeroBounce', 'Hard Bounce', 'Catch-All', 'Spam Traps', 'Email Verification'],
      },
    ],
    quizQuestions: [
      {
        id: '18-3-q1',
        question: 'Какой критический порог Hard Bounce Rate в холодных B2B рассылках нельзя превышать, чтобы не попасть под санкции Gmail и Outlook?',
        options: ['10%', '5%', 'Не более 2% - 3%', '25%'],
        correctOptionIndex: 2,
        explanation: 'Почтовые провайдеры (Google, Microsoft) считают рассылку спамом, если число несуществующих адресов превышает 2-3%.',
        commonMistake: 'Полагают, что пока нет прямых жалоб (Spam Complaints), баунсы не влияют на репутацию домена.',
      },
    ],
    longreadMarkdown: `
### Статусы валидации email и правила обработки

\`\`\`
1. Valid (Deliverable):
   - Почтовый ящик существует, SMTP-сервер подтвердил прием.
   - Действие: Отправлять в основную секвенцию.

2. Invalid (Undeliverable):
   - Ошибка 550 User Not Found.
   - Действие: Немедленно удалять из базы (жесткий бан за отправку).

3. Catch-All (Accept-All / Risky):
   - Сервер компании принимает все письма, но адресат может не существовать.
   - Действие: Проверять через Scrubby/Enrow или отправлять на изолированных доменах порциями <10%.

4. Spam Trap / Disposable / Honeypot:
   - Ловушки спам-фильтров.
   - Действие: Черный список навсегда.
\`\`\`
    `,
  },
];

