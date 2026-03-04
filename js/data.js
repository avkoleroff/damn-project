// База пользователей и константы (подключается до app.js)
const BASE_USERS = {
  user:    { password: "123", role: "user",      face: ":P", label: "Пользователь", name: "Иван", patronymic: "Иванович", city: "Москва" },
  mod:     { password: "123", role: "moderator", face: ":)", label: "Модератор",    name: "Мария", patronymic: "Петровна", city: "Москва" },
  admin:   { password: "123", role: "admin",     face: ":3", label: "Админ",        name: "Админ", patronymic: "", city: "" },

  worker1:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Алексей",   patronymic: "Сергеевич",   kind: "tutor",  specialty: "Математика",   price: 1200, about: "Опыт 8 лет. Подготовка к ЕГЭ и ОГЭ.", city: "Москва", telegram: "@alex_math", email: "alex.tutor@mail.ru", workingHours: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], workingHoursByDay: { 1: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], 2: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], 3: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], 4: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], 5: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }], 6: [{ start: "10:00", end: "14:00" }], 0: [] } },
  worker2:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Марина",    patronymic: "Игоревна",    kind: "tutor",  specialty: "Русский язык", price: 1000, about: "Филолог. Помощь с сочинениями и грамматикой.", city: "Москва", telegram: "@marina_rus", email: "marina.rus@gmail.com", workingHours: [{ start: "10:00", end: "19:00" }], workingHoursByDay: { 1: [{ start: "10:00", end: "19:00" }], 2: [{ start: "10:00", end: "19:00" }], 3: [{ start: "10:00", end: "15:00" }], 4: [{ start: "10:00", end: "19:00" }], 5: [{ start: "10:00", end: "19:00" }], 6: [], 0: [] } },
  worker3:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Дмитрий",   patronymic: "Андреевич",   kind: "tutor",  specialty: "Английский язык", price: 1500, about: "Сертификат C1. Разговорный и бизнес-английский.", city: "Санкт-Петербург", telegram: "@dmitry_eng", email: "", workingHours: [{ start: "09:00", end: "18:00" }] },
  worker4:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Ольга",     patronymic: "Викторовна",  kind: "tutor",  specialty: "Информатика", price: 1300, about: "Программирование на Python и подготовка к олимпиадам.", city: "Москва", telegram: "@olga_it", email: "olga.info@yandex.ru", workingHours: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  worker5:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Сергей",    patronymic: "Николаевич",  kind: "tutor",  specialty: "Математика",   price: 1400, about: "Кандидат наук. Высшая математика и школьная программа.", city: "Казань", telegram: "", email: "sergey.math@mail.ru", workingHours: [{ start: "08:00", end: "15:00" }] },

  worker6:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Антон",     patronymic: "Павлович",    kind: "master", specialty: "Смартфоны",     price: 800,  about: "Замена экранов, батарей. Гарантия на работы.", city: "Москва", telegram: "@anton_repair", email: "", workingHours: [{ start: "10:00", end: "20:00" }] },
  worker7:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Екатерина", patronymic: "Сергеевна",  kind: "master", specialty: "Ноутбуки",     price: 1200, about: "Чистка, замена термопасты, ремонт материнских плат.", city: "Москва", telegram: "@kate_laptop", email: "kate.repair@gmail.com", workingHours: [{ start: "09:00", end: "18:00" }] },
  worker8:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Никита",    patronymic: "Алексеевич",  kind: "master", specialty: "Бытовая техника", price: 1000, about: "Стиральные машины, холодильники, посудомойки.", city: "Санкт-Петербург", telegram: "@nikita_tech", email: "nikita@mail.ru", workingHours: [{ start: "08:00", end: "17:00" }] },
  worker9:  { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Ирина",     patronymic: "Михайловна",  kind: "master", specialty: "Электрика",     price: 1500, about: "Электропроводка, щиты, подключение техники.", city: "Новосибирск", telegram: "@irina_electric", email: "", workingHours: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
  worker10: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Павел",     patronymic: "Романович",   kind: "master", specialty: "Смартфоны",     price: 900,  about: "Ремонт любой сложности. Оригинальные запчасти.", city: "Москва", telegram: "@pavel_phone", email: "pavel.smart@mail.ru", workingHours: [{ start: "10:00", end: "19:00" }] },
  worker11: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Татьяна",   patronymic: "Юрьевна",     kind: "tutor",  specialty: "Русский язык", price: 1100, about: "Подготовка к итоговому сочинению. Риторика.", city: "Екатеринбург", telegram: "@tanya_rus", email: "", workingHours: [{ start: "09:00", end: "18:00" }] },
  worker12: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Константин",patronymic: "Олегович",    kind: "tutor",  specialty: "Информатика", price: 1350, about: "Web-разработка, алгоритмы. Подготовка к экзаменам.", city: "Москва", telegram: "@kostya_dev", email: "konstantin.dev@gmail.com", workingHours: [{ start: "12:00", end: "21:00" }] },
  worker13: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Алина",     patronymic: "Максимовна",  kind: "master", specialty: "Ноутбуки",     price: 1100, about: "Диагностика, ремонт, апгрейд. Apple и Windows.", city: "Казань", telegram: "@alina_laptop", email: "alina@yandex.ru", workingHours: [{ start: "09:00", end: "18:00" }] },
  worker14: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Руслан",    patronymic: "Ильич",       kind: "master", specialty: "Бытовая техника", price: 950,  about: "Ремонт крупной и мелкой техники. Выезд в пригород.", city: "Москва", telegram: "@ruslan_tech", email: "", workingHours: [{ start: "08:00", end: "18:00" }] },
  worker15: { password: "123", role: "worker", face: ":D", label: "Воркер", name: "Юлия",      patronymic: "Александровна",kind: "tutor", specialty: "Английский язык", price: 1300, about: "Дети и взрослые. Подготовка к IELTS и TOEFL.", city: "Санкт-Петербург", telegram: "@yulia_eng", email: "yulia.eng@mail.ru", workingHours: [{ start: "09:00", end: "13:00" }, { start: "15:00", end: "20:00" }] }
};

const STORAGE_KEY = "demo_login_users";
const STORAGE_REVIEWS = "profi_reviews";
const STORAGE_FAVORITES = "profi_favorites";
const STORAGE_BUSY_SLOTS = "profi_busy_slots";
const STORAGE_WORKER_OVERRIDES = "profi_worker_overrides";
const ERROR_IMAGE_SRC = "kanami.png";

const WORKER_SPECIALTIES = {
  tutor: ["Русский язык", "Английский язык", "Математика", "Информатика"],
  master: ["Смартфоны", "Ноутбуки", "Бытовая техника", "Электрика"]
};

const KIND_LABELS = {
  tutor: "Репетитор",
  master: "Мастер по ремонту"
};
