import { Lesson } from '@/entities/lesson';

export const module17Lessons: Lesson[] = [
  {
    id: '17-1-icp-buyer-personas-buying-triggers',
    slug: '17-1-icp-buyer-personas-buying-triggers',
    courseSlug: 'lead-generation',
    moduleId: 17,
    moduleTitle: 'Модуль 1: Фундамент B2B Outbound и исследование рынка',
    lessonNumber: '1.1',
    title: 'ICP (Ideal Customer Profile) и Buyer Personas: критерии включения, триггеры найма и раунды инвестиций',
    level: 'Middle',
    readTimeMinutes: 10,
    targetAudience: 'SDRs, BDRs, Outbound Leads, Growth Marketers',
    summary:
      'Чем идеальный профиль клиента (ICP) отличается от размытого портрета целевой аудитории. Фирмографика (размер компании, выручка, отрасль), технографика (используемый софт) и триггеры покупок (Buying Triggers: смена руководства, найм ключевых ролей, привлечение Seed/Series A-C раундов).',
    competencies: ['PMM & Positioning', 'Enterprise Performance'],
    coreConcepts: [
      {
        title: 'Фирмографика vs Технографика',
        explanation:
          'Фирмографика: жесткие фильтры компании (50-250 сотрудников, B2B SaaS, $5M-$25M ARR, US/UK). Технографика: используемый стек (Salesforce, HubSpot, Snowflake, Stripe), сигнализирующий о зрелости процессов и совместимости вашего решения.',
      },
      {
        title: 'Buying Triggers (Событийные триггеры)',
        explanation:
          'События в жизни компании-аккаунта, открывающие «окно возможностей» для покупки: назначение нового VP of Sales (первые 90 дней — смена софта), открытая вакансия SDR, закрытие раунда финансирования.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Trigger-Based vs Cold Outreach Reply Rate',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 15% - 22% (на аудитории с триггером)',
        dangerZone: '< 4% (слепая холодная база без контекста)',
        calculation: 'Ответы / Доставленные письма по выборке с триггером',
        seniorContext:
          'Письмо, отправленное через 3 дня после новости о закрытии раунда или найме VP, имеет в 3.5 раза более высокий шанс получить согласие на созвон.',
      },
    ],
    researchInsights: [
      {
        source: 'Gartner B2B Buying Journey Survey',
        year: '2023',
        finding:
          'Смена топ-менеджера (VP / C-Level) приводит к пересмотру до 70% существующего технологического стека компании в первые 100 дней пребывания в должности.',
        practicalTakeaway:
          'Настройте в LinkedIn Sales Navigator и Clay автоматический алерт на смену лиц, принимающих решения (ЛПР), в списке целевых аккаунтов.',
      },
    ],
    interviewCases: [
      {
        question:
          'CEO стартапа говорит: «Наш продукт полезен любому бизнесу от пекарни до банка. Собирайте базу всех компаний в США и запускайте аутрич». Как убедить его сузить ICP и какие критерии отбора вы выделите?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание опасности широкого позиционирования, расчет конверсии узких сегментов, методология отбора первых 100 целевых логотипов.',
        antiPatternAnswer: '«Соглашусь и разошлю 100,000 писем всем подряд».',
        seniorBattleTestedAnswer:
          '«Я объясню CEO математику аутрича: рассылка «всем подряд» приведет к попаданию доменов в спам-листы за 7 дней и конверсии в ответ менее 0.5%. Продукт для всех — это продукт ни для кого. Я предложу сузить ICP по 3 критериям: 1) Решенные боли: кто из существующих клиентов закрывает сделку быстрее всего и с наименьшим оттоком? 2) Технографика: есть ли интеграции, критичные для работы нашего сервиса? 3) Триггер боли: у кого прямо сейчас горит проблема (например, компании, активно нанимающие менеджеров по продажам). Мы отберем узкий когортный сегмент из 500 целевых компаний, где персонализированный оффер обеспечит 15%+ конверсию в квалифицированное демо».',
        probingQuestions: [
          'Как ранжировать аккаунты по категориям Tier 1 / Tier 2 / Tier 3?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Сформировал ICP и триггерную воронку, увеличив reply rate с [X]% до [Y]%',
        template:
          'Разработал матрицу ICP и технографические фильтры целевых аккаунтов, повысив конверсию в позитивный ответ с {X}% до {Y}% и сгенерировав ${Z}M пайплайна.',
        concreteExample:
          'Спроектировал профиль идеального клиента (ICP) на базе технографики (Salesforce + Stripe) и триггеров найма, увеличив Outbound Reply Rate с 3.8% до 16.4% и назначив 140+ enterprise демо.',
        keywords: ['ICP', 'Buyer Personas', 'Buying Triggers', 'Technographics', 'Firmographics'],
      },
    ],
    quizQuestions: [
      {
        id: '17-1-q1',
        question: 'Что является наиболее сильным триггером покупки (Buying Trigger) для B2B SaaS инструмента продаж?',
        options: [
          'Компания существует более 50 лет',
          'Назначение нового VP of Sales / CRO и открытие 5+ вакансий SDR за последние 30 дней',
          'Смена цвета логотипа компании',
          'Публикация поздравительного поста в LinkedIn',
        ],
        correctOptionIndex: 1,
        explanation: 'Новый руководитель продаж стремится перестроить стек и масштабировать команду — это максимальная точка готовности инвестировать в новые решения.',
        commonMistake: 'Фокусируются на статичных параметрах (выручка), игнорируя динамические триггеры изменений.',
      },
    ],
    longreadMarkdown: `
### Анатомия идеального B2B ICP: матрица квалификации

\`\`\`
1. Фирмографика (Firmographics):
   - Отрасль: B2B FinTech / CyberSecurity / Supply Chain.
   - Размер: 100 - 500 сотрудников.
   - География: Северная Америка (US/CA) или Западная Европа (UK/DE).
   - Выручка: $10M - $50M ARR.

2. Технографика (Technographics):
   - CRM: Salesforce или HubSpot Enterprise.
   - Email: Google Workspace.
   - Инфраструктура: AWS + Snowflake.

3. Триггеры (Triggers):
   - Привлечение Series A/B раунда за последние 90 дней.
   - Рост headcount отдела продаж >20% за квартал.
   - Смена VP of Engineering или Head of Growth.
\`\`\`
    `,
  },
  {
    id: '17-2-tam-sam-som-account-tiering-abm',
    slug: '17-2-tam-sam-som-account-tiering-abm',
    courseSlug: 'lead-generation',
    moduleId: 17,
    moduleTitle: 'Модуль 1: Фундамент B2B Outbound и исследование рынка',
    lessonNumber: '1.2',
    title: 'TAM (Total Addressable Market), SAM, SOM и трехуровневая приоритизация аккаунтов (Tier 1/2/3 ABM)',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'SDR Leads, Head of Outbound, B2B Growth Directors',
    summary:
      'Декомпозиция целевого рынка от общего TAM до доступного SOM. Архитектура сегментации аккаунтов Account-Based Marketing (ABM): Tier 1 (1:1 глубокая гипер-персонализация), Tier 2 (1:Few кластерная персонализация) и Tier 3 (1:Many масштабируемый автоматический аутрич).',
    competencies: ['Enterprise Performance', 'PMM & Positioning'],
    coreConcepts: [
      {
        title: 'Account Tiering (Tier 1 / Tier 2 / Tier 3)',
        explanation:
          'Tier 1: Топ-50 стратегических компаний с потенциальным чеком $50k-$200k+ (исследование каждого ЛПР, видео-сообщения, подарки). Tier 2: 200-500 аккаунтов со средним чеком (персонализация по отрасли/болям). Tier 3: 2000+ компаний (автоматизированные цепочки с динамическими тегами).',
      },
      {
        title: 'TAM, SAM, SOM в Outbound',
        explanation:
          'TAM: все компании, которым гипотетически нужен продукт. SAM: компании, соответствующие ICP в вашем целевом гео и языковом сегменте. SOM: реально достижимая доля рынка силами текущей SDR-команды за 12 месяцев.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Tier 1 ABM Account-to-Meeting Rate',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 20% - 35% охваченных аккаунтов дают встречу',
        dangerZone: '< 8% (поверхностная персонализация для крупных чеков)',
        calculation: 'Аккаунты с назначенным демо / Всего Tier 1 аккаунтов',
        seniorContext:
          'В Tier 1 аккаунте SDR обязан касаться 3-5 разных стейкхолдеров (Champions, Economic Buyers, Influencers).',
      },
    ],
    researchInsights: [
      {
        source: 'TOPO & Gartner ABM Benchmark Report',
        year: '2023',
        finding:
          'Многопользовательский аутрич (Multi-threading) внутри одного Tier 1 аккаунта (касание одновременно C-Level, VP и Direct Managers) повышает вероятность закрытия сделки на 67%.',
        practicalTakeaway:
          'Никогда не пишите только одному человеку в крупной компании: пишите инициатору проблемы снизу и лицу, подписывающему бюджет, сверху.',
      },
    ],
    interviewCases: [
      {
        question:
          'У вас в базе 10,000 потенциальных компаний и 2 SDR. Как организовать их работу, чтобы они не утонули в рутине и закрыли максимальный план по пайплайну?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Сегментация базы на тиры, распределение усилий (80/20 правило), автоматизация рутины через софт.',
        antiPatternAnswer: '«Разделю 10,000 пополам — пусть каждый отправляет по 250 писем в день».',
        seniorBattleTestedAnswer:
          '«Я применю пирамиду приоритизации ABM: 1) Выделяю 100 ключевых аккаунтов в Tier 1 (потенциальный ACV >$50k): каждый SDR берет по 50 аккаунтов и ведет ручную гипер-персонализацию (Multi-threading, исследование квартальных отчетов 10-K, видео loom); 2) Выделяю 600 аккаунтов в Tier 2 ($15k-$50k): группирую по кластерам болей и настраиваю полуавтоматические секвенции через Clay; 3) Оставшиеся 9,300 компаний перевожу в Tier 3: запускаю полностью автоматизированные цепочки с ящиков-сателлитов (Smartlead/Instantly) с динамической подстановкой данных. Это дает баланс между крупными чеками и стабильным потоком быстрых сделок».',
        probingQuestions: [
          'Как настроить CRM для отслеживания покрытия аккаунта (Account Coverage)?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Внедрил трехуровневую ABM стратегию, увеличив средний чек сделки на [X]%',
        template:
          'Спроектировал модель Account Tiering (Tier 1/2/3) для базы из {X} целевых компаний, повысив конверсию в созвоны в стратегическом сегменте до {Y}% и подняв средний ACV на {Z}%.',
        concreteExample:
          'Разработал трехуровневую стратегию сегментации 4,000 целевых enterprise-аккаунтов, обеспечив 31% конверсию в назначенные созвоны по Tier 1 и сгенерировав $2.4M нового пайплайна.',
        keywords: ['TAM SAM SOM', 'Account Tiering', 'ABM', 'Multi-Threading', 'Enterprise Outbound'],
      },
    ],
    quizQuestions: [
      {
        id: '17-2-q1',
        question: 'Что означает принцип Multi-threading в Enterprise B2B Outbound?',
        options: [
          'Использование многопоточного процессора для отправки писем',
          'Одновременное выстраивание диалога с 3-5 ключевыми стейкхолдерами внутри одной целевой компании (ЛПР, чемпион, пользователь)',
          'Отправка писем с 10 разных доменов одному человеку',
          'Параллельный запуск рекламы в 5 соцсетях',
        ],
        correctOptionIndex: 1,
        explanation: 'В корпоративных сделках решение принимает комитет из 6-10 человек. Касание разных стейкхолдеров создает внутренний резонанс.',
        commonMistake: 'Пишут только одному человеку, и при его игноре или отпуске вся сделка умирает.',
      },
    ],
    longreadMarkdown: `
### Пирамида усилий B2B Outbound (ABM Allocation)

\`\`\`
                 /\\
                /  \\      Tier 1 (Топ 5% аккаунтов / 50% потенциальной выручки):
               /    \\     - 1:1 Гипер-персонализация
              / Tier \\    - Видео-аудиты, исследование подкастов ЛПР
             /   1    \\   - До 10 касаний на аккаунт (Multi-threading)
            /----------\\
           /   Tier 2   \\  Tier 2 (20% аккаунтов / 35% выручки):
          /              \\ - 1:Few (Кластерная персонализация по подотраслям)
         /----------------\\
        /      Tier 3      \\ Tier 3 (75% аккаунтов / 15% выручки):
       /                    \\- 1:Many (Полная автоматизация, короткие письма)
      /----------------------\\
\`\`\`
    `,
  },
  {
    id: '17-3-intent-data-bombora-g2-hiring-signals',
    slug: '17-3-intent-data-bombora-g2-hiring-signals',
    courseSlug: 'lead-generation',
    moduleId: 17,
    moduleTitle: 'Модуль 1: Фундамент B2B Outbound и исследование рынка',
    lessonNumber: '1.3',
    title: 'Сигналы коммерческого намерения (Intent Data): Bombora, G2, открытые вакансии и активность в соцсетях',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'SDR Leads, Outbound Growth Engineers',
    summary:
      'Как узнать, что компания ищет решение прямо сейчас, еще до того, как они заполнили форму на сайте. Источники Intent Data: сторонние темы (Third-Party Intent через Bombora), поведение на сайтах отзывов (G2/Capterra Buyer Intent) и сигналы найма (LinkedIn Jobs, Greenhouse, Lever).',
    competencies: ['PMM & Positioning', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'First-Party vs Third-Party Intent Data',
        explanation:
          '1st Party: деанонимизация посетителей собственного сайта через IP-трекеры (Clearbit Reveal, Factors.ai, Leadfeeder). 3rd Party: фиксация всплеска чтения профильных статей на внешних B2B медиа-площадках (Bombora Co-op).',
      },
      {
        title: 'Hiring Signal Webhooks',
        explanation:
          'Мониторинг публикации вакансий через API (Greenhouse, Lever, LinkedIn Jobs): если компания ищет «Security Compliance Officer», ей гарантированно нужны сервисы аудита SOC2/ISO27001.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Intent-Triggered Outreach Response Rate',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 18% - 25%',
        dangerZone: '< 7% (нерелевантный оффер или опоздание с контактом)',
        calculation: 'Ответы / Доставленные письма компаниям со статусом High Intent',
        seniorContext:
          'Окно активного поиска решения длится от 2 до 6 недель. Быстрый контакт в момент фиксации intent-сигнала решает исход сделки.',
      },
    ],
    researchInsights: [
      {
        source: 'G2 Buyer Intent Research & Forrester',
        year: '2023',
        finding:
          'Компании, которые ищут сравнения вендоров на портале G2 (например, «HubSpot vs Salesforce»), совершают покупку одного из решений в течение 45 дней в 71% случаев.',
        practicalTakeaway:
          'Настройте вебхук с G2 Intent прямо в Slack SDR-команды для звонка в течение 30 минут после посещения страницы сравнения.',
      },
    ],
    interviewCases: [
      {
        question:
          'Как выстроить полностью автоматизированный поток лидов на базе сигналов найма с платформ Greenhouse и LinkedIn Jobs с помощью современных no-code инструментов?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание связки Clay + LinkedIn Jobs + Apollo/Hunter + Instantly/Smartlead, знание Webhook триггеров.',
        antiPatternAnswer: '«Буду вручную сидеть на HeadHunter и копировать контакты в блокнот».',
        seniorBattleTestedAnswer:
          '«Я настрою автоматический пайплайн в Clay: 1) Интеграция с LinkedIn Job Search API: мониторинг компаний в нашем ICP, открывших вакансию «Account Executive» за последние 7 дней; 2) Clay извлекает название компании и находит профиль Head of Sales / VP of Sales; 3) Запускает Waterfall обогащение (Work Email через Prospeo/Dropcontact + мобильный телефон через Datagma); 4) Валидация через ZeroBounce; 5) Генерация AI-персонализированного первого предложения: «Вижу, вы активно расширяете команду AE в связи с ростом…»; 6) Автоматическая загрузка лида в прогретую кампанию Smartlead. Вся цепочка работает автономно 24/7».',
        probingQuestions: [
          'Как исключить ложноположительные сигналы намерения в Bombora?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Построил систему генерации лидов по Intent Data, повысив конверсию в созвоны на [X]%',
        template:
          'Внедрил автоматический пайплайн на базе {X} (G2 Intent + Hiring Signals), сократив цикл ответа на сигналы до {Y} минут и подняв конверсию в SQL на {Z}%.',
        concreteExample:
          'Спроектировал пайплайн в Clay на сигналах найма Greenhouse, автоматически генерирующий 350+ обогащенных аккаунтов в неделю с конверсией в назначенные встречи 19.2%.',
        keywords: ['Intent Data', 'G2 Buyer Intent', 'Bombora', 'Clay Automation', 'Hiring Signals'],
      },
    ],
    quizQuestions: [
      {
        id: '17-3-q1',
        question: 'Что фиксирует технология Third-Party Intent Data (например, Bombora Company Surge)?',
        options: [
          'Пароли от корпоративных почт',
          'Аномальный рост потребления контента по конкретным B2B темам (например, Data Warehousing) сотрудниками определенной компании на тысячах деловых сайтов',
          'Геолокацию генерального директора по GPS',
          'Баланс расчетного счета компании',
        ],
        correctOptionIndex: 1,
        explanation: 'Bombora отслеживает всплеск исследовательского интереса к определенной категории софта со стороны IP-адресов целевой компании.',
        commonMistake: 'Считают, что Intent Data видит только тех, кто зашел на ваш собственный сайт.',
      },
    ],
    longreadMarkdown: `
### 4 типа Intent-сигналов для B2B аутрича

\`\`\`
1. Сигналы найма (Hiring Signals):
   - Появление вакансии "Head of Data" -> компании нужен современный стек аналитики.
   
2. Сигналы отзывов (G2 / Capterra Intent):
   - Компания сравнивает ваш продукт с конкурентом -> горячий лид в стадии выбора.

3. Деанонимизация сайта (Website IP Reveal):
   - Clearbit Reveal фиксирует: сотрудники Cisco провели 14 минут на странице Pricing.

4. Инвестиционные раунды (Funding Signals):
   - Crunchbase API: компания закрыла $15M Series A -> выделены бюджеты на масштабирование.
\`\`\`
    `,
  },
];

