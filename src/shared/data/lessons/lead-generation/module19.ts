import { Lesson } from '@/entities/lesson';

export const module19Lessons: Lesson[] = [
  {
    id: '19-1-secondary-domains-dns-spf-dkim-dmarc-mx',
    slug: '19-1-secondary-domains-dns-spf-dkim-dmarc-mx',
    courseSlug: 'lead-generation',
    moduleId: 19,
    moduleTitle: 'Модуль 3: Инфраструктура Cold Email и Deliverability',
    lessonNumber: '3.1',
    title: 'Архитектура доменов-сателлитов: вторичные домены, Google Workspace vs M365, DNS (SPF, DKIM, DMARC, MX)',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'SDR Leads, Outbound Engineers, IT Operations',
    summary:
      'Золотое правило Outbound: никогда не отправлять холодные письма с основного корпоративного домена компании. Покупка и настройка доменов-сателлитов (.com, .io, .co). Полная настройка DNS-записей по новым стандартам Google/Yahoo 2024 года: жесткая DMARC политика, SPF alignment, 2048-битный DKIM и кастомный MX-трекинг.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Secondary Domain Strategy (Домены-сателлиты)',
        explanation:
          'Использование созвучных доменов (например, getcompany.com, trycompany.com вместо company.com) с настроенным 301-редиректом на основной сайт при переходе из браузера. Полностью изолирует репутацию основного домена от спам-фильтров.',
      },
      {
        title: 'DNS Authentication Quartet (SPF, DKIM, DMARC, MX)',
        explanation:
          'SPF: авторизует IP-адреса серверов отправки. DKIM: криптографическая подпись тела письма приватным ключом. DMARC: инструкция для Gmail/Outlook, что делать с письмами при сбое проверки (p=reject или p=quarantine).',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'DMARC Enforcement Status',
        industry: 'B2B SaaS',
        targetBenchmark: 'p=quarantine или p=reject (100% compliance)',
        dangerZone: 'p=none или отсутствие DMARC (письма сразу летят в спам)',
        calculation: 'Проверка через dig / MXToolbox',
        seniorContext:
          'С февраля 2024 года Google и Yahoo автоматически блокируют любых массовых отправителей без валидной DMARC записи.',
      },
    ],
    researchInsights: [
      {
        source: 'Google & Yahoo Joint Deliverability Guidelines',
        year: '2024',
        finding:
          'Превышение уровня спам-жалоб (Spam Complaint Rate) выше 0.3% в Google Postmaster Tools приводит к перманентной блокировке IP-пула отправителя.',
        practicalTakeaway:
          'Держите показатель спам-жалоб строго ниже 0.1% (не более 1 жалобы на 1,000 отправленных писем).',
      },
    ],
    interviewCases: [
      {
        question:
          'Компания собирается запустить аутрич на 1,000 писем в день. Сколько доменов и почтовых ящиков вам потребуется и как распределить DNS?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Безопасные лимиты (30-40 писем/ящик в день), соотношение домен-ящики (не более 2-3 ящиков на 1 домен), знание прогрева.',
        antiPatternAnswer: '«Куплю 1 домен и настрою 1 ящик на 1,000 писем».',
        seniorBattleTestedAnswer:
          '«Для объема 1,000 писем в день безопасная архитектура следующая: 1) Безопасный лимит отправки: 30-35 холодных писем на один ящик в день; 2) Следовательно, нужно ~30 активных почтовых ящиков; 3) На один вторичный домен создается не более 3 ящиков (например: alex@, john@, kate@), чтобы в случае бана одного ящика не сжечь сразу 10 адресов; 4) Итого: требуется купить 10 вторичных доменов (например, getbrand.com, usebrand.com); 5) Диверсификация: 5 доменов регистрируются в Google Workspace, 5 в Microsoft 365 для балансировки IP-пулов; 6) На каждом домене прописываются SPF, DKIM 2048-bit, DMARC (p=quarantine, pct=100) и настраивается 301 редирект веб-трафика на brand.com».',
        probingQuestions: [
          'Почему нельзя создавать 10 ящиков на одном домене?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Спроектировал инфраструктуру из [X] доменов, обеспечив [Y]% inbox placement',
        template:
          'Развернул отказоустойчивую инфраструктуру холодных рассылок ({X} вторичных доменов, {Y} ящиков в Google/M365) с полной DNS-аутентификацией (SPF/DKIM/DMARC), удержав Deliverability на уровне >{Z}%.',
        concreteExample:
          'Построил инфраструктуру из 14 доменов-сателлитов и 42 ящиков, обеспечив масштабирование аутрича до 35,000 писем/мес с показателем доставляемости во входящие 98.4%.',
        keywords: ['Deliverability', 'Secondary Domains', 'DMARC', 'SPF', 'DKIM', 'Google Workspace'],
      },
    ],
    quizQuestions: [
      {
        id: '19-1-q1',
        question: 'Почему категорически запрещено отправлять холодные B2B рассылки с основного корпоративного домена компании (brand.com)?',
        options: [
          'Это запрещено хостинг-провайдером',
          'При получении жалоб на спам или баунсов основной домен попадет в спам-листы (Spamhaus), и сотрудники компании потеряют возможность отправлять письма клиентам, инвесторам и партнерам',
          'Потому что основной домен стоит дороже',
          'В основном домене нельзя создать больше 1 ящика',
        ],
        correctOptionIndex: 1,
        explanation: 'Репутация домена сгорает быстро. Защита основного домена — главный приоритет безопасности компании.',
        commonMistake: 'Экономят на покупке вторичных доменов, подвергая смертельному риску всю корпоративную переписку.',
      },
    ],
    longreadMarkdown: `
### Стандарт настройки DNS для вторичного домена

\`\`\`
1. MX Записи (Google Workspace):
   Priority 1: ASPMX.L.GOOGLE.COM
   Priority 5: ALT1.ASPMX.L.GOOGLE.COM
   Priority 5: ALT2.ASPMX.L.GOOGLE.COM

2. TXT Запись SPF:
   v=spf1 include:_spf.google.com ~all

3. TXT Запись DKIM (2048 bit):
   google._domainkey.trycompany.com -> v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BA...

4. TXT Запись DMARC:
   _dmarc.trycompany.com -> v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@trycompany.com; sp=quarantine

5. A Запись / 301 Редирект:
   Посетители trycompany.com в браузере мгновенно перенаправляются на главный сайт company.com.
\`\`\`
    `,
  },
  {
    id: '19-2-inbox-warmup-smartlead-instantly-volume-caps',
    slug: '19-2-inbox-warmup-smartlead-instantly-volume-caps',
    courseSlug: 'lead-generation',
    moduleId: 19,
    moduleTitle: 'Модуль 3: Инфраструктура Cold Email и Deliverability',
    lessonNumber: '3.2',
    title: 'Прогрев почтовых ящиков (Warm-up Pools), Smartlead, Instantly и безопасные лимиты отправки',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'SDRs, Outbound Campaign Managers',
    summary:
      'Механика прогрева почтовых аккаунтов через пиринговые пулы (Warm-up Networks в Instantly и Smartlead). Расписание прогрева: 14-21 день калибровки, соотношение warm-up писем к реальным отправкам, авто-вытаскивание из спама и эмуляция человеческого поведения.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Peer-to-Peer Warm-Up Pool',
        explanation:
          'Сеть из десятков тысяч реальных почтовых ящиков, которые автоматически отправляют друг другу письма, открывают их, помечают как важные (Mark as Important) и вытаскивают из спама, повышая репутацию в глазах спам-фильтров.',
      },
      {
        title: 'Ramp-Up Schedule (График разгона)',
        explanation:
          'Постепенное наращивание объема: День 1-3 (3-5 писем), День 4-7 (10-15 писем), День 8-14 (20-30 писем). Запуск реальных кампаний разрешен строго после 14 дней прогрева.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Warm-up Health Score',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 95% - 98%',
        dangerZone: '< 85% (ящик попал под спам-фильтры, требует остановки кампании)',
        calculation: 'Процент писем прогрева, попавших в Primary Inbox / Всего отправленных',
        seniorContext:
          'Никогда не отключайте прогрев во время отправки реальных писем — warm-up должен составлять 25-30% от суточного трафика ящика.',
      },
    ],
    researchInsights: [
      {
        source: 'Smartlead Deliverability Labs Study',
        year: '2023',
        finding:
          'Отправка более 50 реальных холодных писем в сутки с одного ящика Google Workspace повышает вероятность попадания в спам на 64% уже на 3-й неделе рассылки.',
        practicalTakeaway:
          'Держите железный лимит: 30-35 реальных писем + 15 warm-up писем в день на один ящик.',
      },
    ],
    interviewCases: [
      {
        question:
          'Вы запустили новый ящик 3 дня назад и хотите срочно отправить 300 писем, так как горит месячный план. Что произойдет и как вы поступите?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание алгоритмов поведенческого анализа почтовых провайдеров, стойкость к нарушению правил ради сиюминутной выгоды.',
        antiPatternAnswer: '«Отправлю 300 писем, если текст хороший, ничего не будет».',
        seniorBattleTestedAnswer:
          '«Если с нового ящика на 3-й день отправить 300 холодных писем, алгоритмы защиты Google/Outlook зафиксируют аномальный всплеск (Spike) на неи прогретом аккаунте и либо навсегда отправят домен в черный список, либо заблокируют сам ящик с ошибкой «Account Suspended for Suspicious Activity». Никакой план не стоит сожженной инфраструктуры. Я объясню руководству, что прогрев — это физическое требование интернет-протоколов (минимум 14 дней). Для выполнения плана я задействую уже прогретые резервные домены компании, либо перераспределю объем малыми порциями по существующим стабильным ящикам».',
        probingQuestions: [
          'Как настроить рандомизацию интервалов отправки (Time Jitter)?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Удержал deliverability на уровне [X]%, внедрив протокол прогрева [Y]',
        template:
          'Выстроил систему автоматического прогрева и ротации {X} почтовых ящиков в Smartlead/Instantly, удержав Deliverability во входящие на уровне {Y}% на протяжении 12 месяцев.',
        concreteExample:
          'Управлял пулом из 60 почтовых ящиков с распределенной нагрузкой 30 писем/день и непрерывным прогревом, обеспечив стабильный Inbox Placement 97.8% без единой блокировки доменов.',
        keywords: ['Inbox Warmup', 'Smartlead', 'Instantly', 'Deliverability Caps', 'Ramp-up Schedule'],
      },
    ],
    quizQuestions: [
      {
        id: '19-2-q1',
        question: 'Какое соотношение реальных писем и писем прогрева (Warm-up) считается оптимальным во время активной кампании?',
        options: [
          '100% реальных, прогрев нужно полностью выключить',
          '70-75% реальных писем и 25-30% писем прогрева (для поддержания высокого коэффициента открытий и ответов)',
          '1% реальных и 99% прогрева',
          'Только письма в выходные дни',
        ],
        correctOptionIndex: 1,
        explanation: 'Фоновый прогрев создает положительные поведенческие сигналы (открытия, ответы, вытаскивание из спама), балансируя негативные сигналы от холодных писем.',
        commonMistake: 'Выключают прогрев сразу после запуска кампании, после чего ящик быстро выгорает.',
      },
    ],
    longreadMarkdown: `
### Календарный план разгона ящика (3-Week Ramp-Up Schedule)

\`\`\`
Неделя 1: Чистый прогрев (0 реальных писем)
- День 1-3: 5 писем прогрева в день
- День 4-7: 15 писем прогрева в день

Неделя 2: Калибровка (0 реальных писем)
- День 8-14: 25-30 писем прогрева в день. Проверка SPF/DMARC в Mail-Tester (10/10).

Неделя 3: Старт реальных отправок
- День 15-17: 10 реальных писем + 20 прогрева
- День 18-21: 20 реальных писем + 15 прогрева

Неделя 4+: Крейсерский режим
- Ежедневно: 30-35 реальных писем + 12-15 прогрева (строгий потолок!)
\`\`\`
    `,
  },
  {
    id: '19-3-spam-triggers-open-rate-vs-reply-rate-privacy',
    slug: '19-3-spam-triggers-open-rate-vs-reply-rate-privacy',
    courseSlug: 'lead-generation',
    moduleId: 19,
    moduleTitle: 'Модуль 3: Инфраструктура Cold Email и Deliverability',
    lessonNumber: '3.3',
    title: 'Спам-триггеры, трекинг открытий (Open Rate) vs Reply Rate и конфиденциальность (Apple MPP)',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'SDRs, Email Copywriters, Outbound Leads',
    summary:
      'Почему профессиональные SDR отключают пиксели отслеживания открытий (Open Tracking Pixels). Как невидимые трекинговые пиксели триггерят спам-фильтры. Спам-слова в теме и теле письма, запрет ссылок в первом письме и оптимизация текста под plain-text формат.',
    competencies: ['Enterprise Performance', 'PMM & Positioning'],
    coreConcepts: [
      {
        title: 'Open Tracking Pixel Penalty',
        explanation:
          'Внедрение невидимой картинки 1x1 для отслеживания Open Rate распознается корпоративными спам-фильтрами как трекер и повышает Spam Score письма. Отключение пикселя поднимает доставляемость на 15-20%.',
      },
      {
        title: 'Plain-Text Format (Чистый текст)',
        explanation:
          'Письмо без HTML-верстки, таблиц, ярких кнопок и сторонних ссылок. Выглядит для спам-фильтра как обычное персональное письмо от коллеги, минуя промо-вкладки.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'True Positive Reply Rate',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 8% - 15% (главная метрика эффективности вместо Open Rate)',
        dangerZone: '< 3% (слабый оффер или попадание в спам)',
        calculation: 'Ответы от живых людей / Всего отправленных писем',
        seniorContext:
          'После реформы Apple Mail Privacy Protection (MPP) Open Rate стал фиктивной метрикой (роботы автоматически открывают 100% писем). Настоящий KPI — только Reply Rate.',
      },
    ],
    researchInsights: [
      {
        source: 'Instantly & Email Deliverability Lab Report',
        year: '2023',
        finding:
          'Письма без ссылок и картинок в первом касании (Step 1) имеют на 38% более высокий шанс попасть в папку Primary Inbox по сравнению с письмами, содержащими ссылку на календарь Calendly.',
        practicalTakeaway:
          'Никогда не вставляйте ссылки в первое письмо. Ссылку на бронирование созвона отправляйте ТОЛЬКО в ответ на позитивную реакцию адресата.',
      },
    ],
    interviewCases: [
      {
        question:
          'Почему в первом холодном письме нельзя давать ссылку на Calendly/Cal.com и как корректно сформулировать призыв к действию (CTA)?',
        difficulty: 'Middle',
        whatInterviewerLooksFor:
          'Понимание спам-фильтров (ссылка в первом письме от незнакомца = подозрение на фишинг) и психологии (No-Commitment CTA).',
        antiPatternAnswer: '«Потому что Calendly некрасивый сервис».',
        seniorBattleTestedAnswer:
          '«По двум фундаментальным причинам: 1) Техническая: спам-фильтры Google и Microsoft сканируют внешние ссылки в письмах от новых отправителей. Ссылки на календари и сторонние домены резко увеличивают Spam Score и ведут в Promotions или Spam; 2) Психологическая: ссылка на календарь («Забронируйте 30 минут в моем расписании») требует от занятого топ-менеджера слишком много усилий и выглядит высокомерно. Правильный подход — Plain-text письмо без ссылок с CTA с низким порогом входа (Interest-Based CTA): «Вам в принципе интересно узнать, как мы решили эту задачу для [Компания-Аналог]?» Ссылку на звонок мы отправляем только после его согласия».',
        probingQuestions: [
          'Какие стоп-слова в теме письма вызывают мгновенный бан?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Поднял Reply Rate до [X]%, оптимизировав структуру писем под Plain-Text',
        template:
          'Перевел B2B аутрич на Plain-Text формат без отслеживающих пикселей и внешних ссылок, повысив доставляемость до {X}% и увеличив Reply Rate с {Y}% до {Z}%.',
        concreteExample:
          'Ликвидировал трекинг-пиксели и внешние ссылки из первого касания холодных цепочек, подняв доставляемость в Primary Inbox до 98.2% и удвоив конверсию в созвоны.',
        keywords: ['Plain-Text', 'Open Tracking', 'Spam Filters', 'Apple MPP', 'Deliverability Optimization'],
      },
    ],
    quizQuestions: [
      {
        id: '19-3-q1',
        question: 'Почему опытные специалисты по Cold Email отключают отслеживание открытий (Open Tracking) в первом письме?',
        options: [
          'Чтобы сэкономить оперативную память компьютера',
          'Трекинговый пиксель распознается спам-фильтрами как скрытый трекер, снижая доставляемость письма на 15-20%, а Apple MPP все равно делает метрику неточной',
          'Потому что в Smartlead нет такой кнопки',
          'Закон запрещает смотреть открытия',
        ],
        correctOptionIndex: 1,
        explanation: 'Чистый plain-text без пикселей имеет максимальную доставляемость, неотличимую от личной переписки.',
        commonMistake: 'Ориентируются на красивый Open Rate 70%, не понимая, что письма лежат в промо-акциях или спаме.',
      },
    ],
    longreadMarkdown: `
### Стоп-слова и триггеры спам-фильтров

\`\`\`
1. Финансовые триггеры:
   - "100% guarantee", "Free", "No cost", "Cash", "Make money", "Risk-free".

2. Маркетинговый спам:
   - "Special promotion", "Act now!", "Urgent", "Limited time offer", "Click here".

3. Форматирование:
   - ВСЕ ЗАГЛАВНЫЕ БУКВЫ в теме письма (CAPS LOCK).
   - Множественные восклицательные знаки (!!!).
   - Разноцветный шрифт и HTML-шаблоны.
   - Наличие сокращателей ссылок (bit.ly, tinyurl).
\`\`\`
    `,
  },
];

