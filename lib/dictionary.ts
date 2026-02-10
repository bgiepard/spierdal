// Deflate dictionary for Polish text and URL compression (max useful ~32KB)
// The dictionary pre-seeds the LZ77 sliding window — words here
// are immediately available for matching from the first byte of input.

export const DICTIONARY = new TextEncoder().encode(
  // === URL PATTERNS ===
  "https://www.https://http://www. " +
  ".com/.pl/.org/.net/.io/.dev/.co/.eu/.info/.edu/ " +
  ".com.pl.org.net.io.dev.co.eu.info.edu " +
  "?utm_source=&utm_medium=&utm_campaign=&utm_content=&utm_term= " +
  "?q=&page=&id=&ref=&lang=pl&sort=&filter=&search=&category=&tag=&token=&key=&v= " +
  "index.html index.php default.aspx " +
  "/api/v1//api/v2//api/ " +

  // === POLISH PRONOUNS (all forms) ===
  "ja mnie mi mną " +
  "ty ciebie cię tobie ci tobą " +
  "on jego go jemu mu nim " +
  "ona jej ją niej nią " +
  "ono jego go jemu mu nim je " +
  "my nas nam nami " +
  "wy was wam wami " +
  "oni ich im nich nimi " +
  "one ich im nie nimi je " +
  "się siebie sobie sobą " +
  // Demonstrative
  "ten ta to ci te tego tej tych temu tym tę tą " +
  "tamten tamta tamto tamci tamte tamtego tamtej tamtych tamtemu tamtym tamtę tamtą " +
  "taki taka takie tacy takich takim takiej taką takiego " +
  // Possessive
  "mój moja moje moi moich moim mojej moją mojego " +
  "twój twoja twoje twoi twoich twoim twojej twoją twojego " +
  "swój swoja swoje swoi swoich swoim swojej swoją swojego " +
  "nasz nasza nasze nasi naszych naszym naszej naszą naszego " +
  "wasz wasza wasze wasi waszych waszym waszej waszą waszego " +
  // Interrogative / relative
  "kto kogo komu kim czym " +
  "co czego czemu " +
  "jaki jaka jakie jacy jakich jakim jakiej jaką jakiego " +
  "który która które którzy których którym której którą którego " +
  "czyj czyja czyje czyi czyich czyim czyjej czyją czyjego " +
  // Indefinite
  "jakiś jakaś jakieś jacyś jakichś jakimś jakiejś jakąś jakiegoś " +
  "ktoś kogoś komuś kimś " +
  "coś czegoś czemuś " +
  "każdy każda każde każdego każdej każdemu każdą każdym " +
  "żaden żadna żadne żadni żadnych żadnym żadnej żadną żadnego " +
  "wszystek wszystko wszystka wszystkie wszyscy wszystkich wszystkim wszystkiego " +
  "sam sama samo sami same samych samym samej samą samego " +
  "inny inna inne inni innych innym innej inną innego " +
  "niektóry niektóra niektóre niektórzy niektórych niektórym niektórej niektórą niektórego " +

  // === VERBS (common, all tenses/persons) ===
  // być
  "być jest jestem jesteś jesteśmy jesteście są " +
  "był była było byli były byłem byłeś byłam byłaś " +
  "będę będziesz będzie będziemy będziecie będą " +
  "byłby byłaby byłoby byliby byłyby " +
  "bądź bądźmy bądźcie " +
  // mieć
  "mieć mam masz ma mamy macie mają " +
  "miał miała miało mieli miały miałem miałeś miałam miałaś " +
  "miałby miałaby miałoby mieliby miałyby " +
  // móc
  "móc mogę możesz może możemy możecie mogą " +
  "mógł mogła mogło mogli mogły mogłem mogłeś mogłam mogłaś " +
  "mógłby mogłaby mogłoby mogliby mogłyby " +
  // musieć
  "musieć muszę musisz musi musimy musicie muszą " +
  "musiał musiała musiało musieli musiały musiałem musiałeś musiałam musiałaś " +
  // chcieć
  "chcieć chcę chcesz chce chcemy chcecie chcą " +
  "chciał chciała chciało chcieli chciały chciałem chciałeś chciałam chciałaś " +
  "chciałby chciałaby chciałoby chcieliby chciałyby " +
  // wiedzieć
  "wiedzieć wiem wiesz wie wiemy wiecie wiedzą " +
  "wiedział wiedziała wiedziało wiedzieli wiedziały wiedziałem wiedziałeś wiedziałam wiedziałaś " +
  // mówić / powiedzieć
  "mówić mówię mówisz mówi mówimy mówicie mówią " +
  "mówił mówiła mówiło mówili mówiły mówiłem mówiłeś mówiłam mówiłaś " +
  "powiedzieć powiedział powiedziała powiedziało powiedzieli powiedziały powie powiedzą " +
  "powiem powiesz powiemy powiecie " +
  // robić / zrobić
  "robić robię robisz robi robimy robicie robią " +
  "robił robiła robiło robili robiły robiłem robiłeś robiłam robiłaś " +
  "zrobić zrobię zrobisz zrobi zrobimy zrobicie zrobią " +
  "zrobił zrobiła zrobiło zrobili zrobiły zrobiłem zrobiłeś zrobiłam zrobiłaś " +
  // iść / jechać
  "iść idę idziesz idzie idziemy idziecie idą " +
  "szedł szła szło szli szły szedłem szedłeś szłam szłaś " +
  "pójść pójdę pójdziesz pójdzie pójdziemy pójdziecie pójdą " +
  "jechać jadę jedziesz jedzie jedziemy jedziecie jadą " +
  "jechał jechała jechało jechali jechały jechałem jechałeś jechałam jechałaś " +
  "pojechać pojadę pojedziesz pojedzie pojedziemy pojedziecie pojadą " +
  // dać / wziąć
  "dać dam dasz da damy dacie dadzą dał dała dało dali dały " +
  "wziąć wezmę weźmiesz weźmie weźmiemy weźmiecie wezmą wziął wzięła wzięło wzięli wzięły " +
  // stać / siedzieć
  "stać stoję stoisz stoi stoimy stoicie stoją stał stała stało stali stały " +
  "siedzieć siedzę siedzisz siedzi siedzimy siedzicie siedzą siedział siedziała siedziało siedzieli siedziały " +
  // widzieć / zobaczyć / patrzeć
  "widzieć widzę widzisz widzi widzimy widzicie widzą widział widziała widziało widzieli widziały " +
  "zobaczyć zobaczę zobaczysz zobaczy zobaczymy zobaczycie zobaczą zobaczył zobaczyła zobaczyło zobaczyli zobaczyły " +
  "patrzeć patrzę patrzysz patrzy patrzymy patrzycie patrzą patrzył patrzyła patrzyło patrzyli patrzyły " +
  // słuchać / słyszeć
  "słuchać słucham słuchasz słucha słuchamy słuchacie słuchają słuchał słuchała " +
  "słyszeć słyszę słyszysz słyszy słyszymy słyszycie słyszą słyszał słyszała " +
  // myśleć / znać / rozumieć
  "myśleć myślę myślisz myśli myślimy myślicie myślą myślał myślała " +
  "znać znam znasz zna znamy znacie znają znał znała " +
  "rozumieć rozumiem rozumiesz rozumie rozumiemy rozumiecie rozumieją rozumiał rozumiała " +
  // pisać / czytać
  "pisać piszę piszesz pisze piszemy piszecie piszą pisał pisała " +
  "czytać czytam czytasz czyta czytamy czytacie czytają czytał czytała " +
  // kupić / sprzedać / płacić
  "kupić kupię kupisz kupi kupimy kupicie kupią kupił kupiła " +
  "sprzedać sprzedam sprzedasz sprzeda sprzedamy sprzedacie sprzedadzą sprzedał sprzedała " +
  "płacić płacę płacisz płaci płacimy płacicie płacą płacił płaciła " +
  // pracować / mieszkać / uczyć
  "pracować pracuję pracujesz pracuje pracujemy pracujecie pracują pracował pracowała " +
  "mieszkać mieszkam mieszkasz mieszka mieszkamy mieszkacie mieszkają mieszkał mieszkała " +
  "uczyć uczę uczysz uczy uczymy uczycie uczą uczył uczyła " +
  "uczyć się uczę się uczysz się uczy się uczymy się uczycie się uczą się " +
  // lubić / kochać / nienawidzić
  "lubić lubię lubisz lubi lubimy lubicie lubią lubił lubiła " +
  "kochać kocham kochasz kocha kochamy kochacie kochają kochał kochała " +
  // prosić / dziękować / przepraszać
  "prosić proszę prosisz prosi prosimy prosicie proszą prosił prosiła " +
  "dziękować dziękuję dziękujesz dziękuje dziękujemy dziękujecie dziękują " +
  "przepraszać przepraszam przepraszasz przeprasza przepraszamy przepraszacie przepraszają " +
  // jeść / pić / spać
  "jeść jem jesz je jemy jecie jedzą jadł jadła " +
  "pić piję pijesz pije pijemy pijecie piją pił piła " +
  "spać śpię śpisz śpi śpimy śpicie śpią spał spała " +
  // czekać / szukać / znaleźć
  "czekać czekam czekasz czeka czekamy czekacie czekają czekał czekała " +
  "szukać szukam szukasz szuka szukamy szukacie szukają szukał szukała " +
  "znaleźć znajdę znajdziesz znajdzie znajdziemy znajdziecie znajdą znalazł znalazła " +
  // zostać / wrócić / wyjść
  "zostać zostanę zostaniesz zostanie zostaniemy zostaniecie zostaną został została zostało zostali zostały " +
  "wrócić wrócę wrócisz wróci wrócimy wrócicie wrócą wrócił wróciła " +
  "wyjść wyjdę wyjdziesz wyjdzie wyjdziemy wyjdziecie wyjdą wyszedł wyszła " +
  // grać / bawić / pomagać
  "grać gram grasz gra gramy gracie grają grał grała " +
  "bawić bawię bawisz bawi bawimy bawicie bawią bawił bawiła " +
  "pomagać pomagam pomagasz pomaga pomagamy pomagacie pomagają pomagał pomagała " +
  // impersonal
  "można trzeba należy warto wolno wypada " +

  // === CONJUNCTIONS / PREPOSITIONS / PARTICLES ===
  "i a ale lub albo bądź ani ni " +
  "że żeby aby by żebyś abyś żebyśmy abyśmy " +
  "bo ponieważ gdyż bowiem dlatego że jako że z powodu " +
  "jeśli jeżeli gdyby o ile pod warunkiem że w przypadku gdy " +
  "chociaż choć mimo że pomimo że nawet jeśli nawet gdyby " +
  "więc zatem wobec tego w związku z tym dlatego też " +
  "w na do od z ze za po przez przed pod nad między przy " +
  "o u we bez dla obok wśród poza wokół " +
  "nie tak bardzo " +

  // === ADVERBS ===
  "dobrze źle szybko wolno daleko blisko wysoko nisko głęboko szeroko wąsko " +
  "teraz potem wtedy zawsze nigdy często rzadko czasem czasami " +
  "już jeszcze ciągle wciąż nadal znowu znów " +
  "tutaj tam wszędzie nigdzie gdzieś dokądś skądś " +
  "dzisiaj wczoraj jutro rano wieczorem " +
  "naprawdę właśnie właściwie szczególnie oczywiście niestety " +
  "prawie raczej całkiem dość dosyć wystarczająco " +
  "tylko również także też nawet zwłaszcza " +
  "pewnie chyba może na pewno z pewnością " +
  "trochę dużo mało wiele niewiele sporo " +
  "razem osobno wspólnie oddzielnie " +
  "natychmiast zaraz od razu wkrótce niedługo " +

  // === ADJECTIVES (common, all genders) ===
  "dobry dobra dobre dobrzy dobrych dobrym dobrej dobrą dobrego " +
  "zły zła złe źli złych złym złej złą złego " +
  "duży duża duże duzi dużych dużym dużej dużą dużego " +
  "mały mała małe mali małych małym małej małą małego " +
  "nowy nowa nowe nowi nowych nowym nowej nową nowego " +
  "stary stara stare starzy starych starym starej starą starego " +
  "młody młoda młode młodzi młodych młodym młodej młodą młodego " +
  "ważny ważna ważne ważni ważnych ważnym ważnej ważną ważnego " +
  "piękny piękna piękne piękni pięknych pięknym pięknej piękną pięknego " +
  "ładny ładna ładne ładni ładnych ładnym ładnej ładną ładnego " +
  "brzydki brzydka brzydkie brzydcy brzydkich brzydkim brzydkiej brzydką brzydkiego " +
  "długi długa długie dłudzy długich długim długiej długą długiego " +
  "krótki krótka krótkie krótcy krótkich krótkim krótkiej krótką krótkiego " +
  "wysoki wysoka wysokie wysocy wysokich wysokim wysokiej wysoką wysokiego " +
  "niski niska niskie niscy niskich niskim niskiej niską niskiego " +
  "szybki szybka szybkie szybcy szybkich szybkim szybkiej szybką szybkiego " +
  "wolny wolna wolne wolni wolnych wolnym wolnej wolną wolnego " +
  "polski polska polskie polscy polskich polskim polskiej polską polskiego " +
  "pierwszy pierwsza pierwsze pierwsi pierwszych pierwszym pierwszej pierwszą pierwszego " +
  "ostatni ostatnia ostatnie ostatnich ostatnim ostatniej ostatnią ostatniego " +
  "następny następna następne następnych następnym następnej następną następnego " +
  "lepszy lepsza lepsze lepsi lepszych lepszym lepszej lepszą lepszego " +
  "gorszy gorsza gorsze gorsi gorszych gorszym gorszej gorszą gorszego " +
  "większy większa większe więksi większych większym większej większą większego " +
  "mniejszy mniejsza mniejsze mniejsi mniejszych mniejszym mniejszej mniejszą mniejszego " +
  "najlepszy najlepsza najlepsze najlepsi najlepszych najlepszym najlepszej najlepszą najlepszego " +

  // === NOUNS (common) ===
  // Time
  "czas chwila moment sekunda minuta godzina dzień noc rano wieczór " +
  "tydzień miesiąc rok data termin okres sezon " +
  // People
  "człowiek ludzie osoba kobieta mężczyzna dziecko dzieci baby dziewczyna chłopak " +
  "rodzina mama tata ojciec matka brat siostra syn córka " +
  "mąż żona dziadek babcia wujek ciotka kuzyn " +
  "przyjaciel przyjaciółka kolega koleżanka sąsiad sąsiadka " +
  // Places
  "dom mieszkanie pokój kuchnia łazienka sypialnia salon " +
  "miejsce ulica droga plac park ogród " +
  "miasto wieś kraj państwo region " +
  "szkoła uniwersytet liceum gimnazjum przedszkole " +
  "praca biuro firma fabryka sklep restauracja kawiarnia hotel szpital kościół " +
  "lotnisko dworzec przystanek stacja " +
  // Things
  "rzecz sprawa sytuacja historia prawda " +
  "pieniądze złoty złotych euro dolar cena koszt " +
  "telefon komputer laptop tablet internet strona email wiadomość " +
  "samochód autobus pociąg tramwaj rower metro taksówka " +
  "jedzenie woda kawa herbata piwo wino mleko chleb mięso ser masło " +
  "książka gazeta czasopismo film muzyka piosenka gra sport " +
  "klucz drzwi okno ściana podłoga sufit dach " +
  // Abstract
  "życie śmierć zdrowie choroba miłość szczęście " +
  "problem pytanie odpowiedź pomoc informacja przykład " +
  "sposób powód cel sens wartość " +
  "część punkt koniec początek środek " +
  "praca nauka wiedza doświadczenie umiejętność " +
  "imię nazwisko numer adres hasło " +
  "słowo zdanie tekst język " +
  "pomysł plan projekt decyzja wybór opcja " +
  "zmiana różnica porównanie związek " +

  // === NUMBERS ===
  "zero jeden dwa trzy cztery pięć sześć siedem osiem dziewięć dziesięć " +
  "jedenaście dwanaście trzynaście czternaście piętnaście szesnaście siedemnaście osiemnaście dziewiętnaście " +
  "dwadzieścia trzydzieści czterdzieści pięćdziesiąt sześćdziesiąt siedemdziesiąt osiemdziesiąt dziewięćdziesiąt " +
  "sto dwieście trzysta czterysta pięćset sześćset siedemset osiemset dziewięćset " +
  "tysiąc milion miliard " +

  // === DAYS / MONTHS ===
  "poniedziałek wtorek środa czwartek piątek sobota niedziela " +
  "styczeń luty marzec kwiecień maj czerwiec lipiec sierpień wrzesień październik listopad grudzień " +

  // === CITIES / COUNTRIES ===
  "Warszawa Kraków Wrocław Poznań Gdańsk Łódź Katowice Lublin Szczecin Bydgoszcz Białystok " +
  "Gdynia Częstochowa Radom Toruń Kielce Rzeszów Olsztyn Opole Gliwice Zabrze Sosnowiec " +
  "Polska Niemcy Anglia Wielka Brytania Francja Hiszpania Włochy Ukraina Czechy " +
  "Stany Zjednoczone Rosja Chiny Japonia Kanada Australia " +
  "Europa Azja Afryka Ameryka " +

  // === COLORS ===
  "biały czarny czerwony niebieski zielony żółty szary brązowy " +
  "pomarańczowy fioletowy różowy złoty srebrny " +

  // === COMMON PHRASES ===
  "w porządku nie ma za co proszę bardzo jak się masz co słychać " +
  "do widzenia na razie do zobaczenia pa cześć " +
  "dzień dobry dobry wieczór dobranoc witam witaj " +
  "tak jest nie ma oczywiście że tak jasne pewnie " +
  "nie wiem nie mogę nie chcę nie trzeba nie można " +
  "dlatego że ponieważ bo " +
  "mimo że chociaż pomimo " +
  "na przykład to znaczy to jest czyli innymi słowy " +
  "w każdym razie w sumie generalnie ogólnie zasadniczo " +
  "przede wszystkim po pierwsze po drugie po trzecie wreszcie w końcu na koniec " +
  "co do w sprawie jeśli chodzi o odnośnie " +
  "moim zdaniem według mnie uważam że wydaje mi się sądzę że " +
  "z jednej strony z drugiej strony natomiast jednakże niemniej jednak " +
  "od tego czasu od tamtej pory w międzyczasie tymczasem " +
  "z góry z dołu z boku z tyłu z przodu na górze na dole "
);
