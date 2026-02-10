// Deflate dictionary for Polish text and URL compression (max useful ~32KB)
// The dictionary pre-seeds the LZ77 sliding window — words here
// are immediately available for matching from the first byte of input.

export const DICTIONARY = new TextEncoder().encode(
  // === URL PATTERNS ===
  "https://www.https://http://www. " +
  ".com/.pl/.org/.net/.io/.dev/.co/.eu/.info/.edu/.gov/.tv/.gg/.me/.app/.xyz/ " +
  ".com.pl.org.net.io.dev.co.eu.info.edu.gov.tv.gg.me.app.xyz " +
  "?utm_source=&utm_medium=&utm_campaign=&utm_content=&utm_term= " +
  "?q=&page=&id=&ref=&lang=pl&sort=&filter=&search=&category=&tag=&token=&key=&v=&t=&s=&type= " +
  "index.html index.php " +
  "/api/v1//api/v2//api/ " +

  // === POPULAR DOMAINS (social media, platforms) ===
  "youtube.com/watch?v=youtu.be/youtube.com/shorts/youtube.com/playlist?list=youtube.com/channel/youtube.com/@" +
  "facebook.com/instagram.com/twitter.com/x.com/tiktok.com/@tiktok.com/linkedin.com/in/linkedin.com/company/" +
  "reddit.com/r/reddit.com/u/reddit.com/comments/threads.net/pinterest.com/pin/" +
  "discord.gg/discord.com/channels/discord.com/invite/t.me/telegram.me/" +
  "twitch.tv/snapchat.com/add/whatsapp.com/" +
  "github.com/gitlab.com/bitbucket.org/stackoverflow.com/questions/" +
  "docs.google.com/document/d/docs.google.com/spreadsheets/d/docs.google.com/presentation/d/" +
  "drive.google.com/file/d/drive.google.com/drive/folders/" +
  "google.com/search?q=google.pl/search?q=google.com/maps/" +
  "maps.google.com/maps.app.goo.gl/" +

  // === POPULAR POLISH DOMAINS ===
  "allegro.pl/oferta/allegro.pl/listing?string=allegro.pl/kategoria/" +
  "olx.pl/d/oferta/olx.pl/praca/olx.pl/nieruchomosci/" +
  "wp.pl/onet.pl/interia.pl/gazeta.pl/tvn24.pl/polsatnews.pl/" +
  "money.pl/bankier.pl/pracuj.pl/wykop.pl/pudelek.pl/sport.pl/" +
  "ceneo.pl/morele.net/x-kom.pl/mediaexpert.pl/rtveuroagd.pl/empik.com/" +
  "filmweb.pl/film/lubimyczytac.pl/" +
  "poczta-polska.pl/inpost.pl/" +
  "gov.pl/web/moj.gov.pl/epuap.gov.pl/biznes.gov.pl/" +
  "zus.pl/podatki.gov.pl/obywatel.gov.pl/" +

  // === POPULAR INTERNATIONAL DOMAINS ===
  "wikipedia.org/wiki/en.wikipedia.org/wiki/pl.wikipedia.org/wiki/" +
  "amazon.com/dp/amazon.de/dp/amazon.co.uk/" +
  "ebay.com/itm/ebay.pl/" +
  "netflix.com/title/spotify.com/track/spotify.com/playlist/spotify.com/album/" +
  "apple.com/music.apple.com/apps.apple.com/" +
  "play.google.com/store/apps/details?id=" +
  "medium.com/@medium.com/p/" +
  "notion.so/figma.com/file/canva.com/design/" +
  "zoom.us/j/meet.google.com/teams.microsoft.com/" +
  "chat.openai.com/chatgpt.com/claude.ai/chat/" +
  "vercel.app/netlify.app/herokuapp.com/pages.dev/" +
  "dropbox.com/s/wetransfer.com/downloads/" +
  "booking.com/hotel/airbnb.com/rooms/" +
  "paypal.com/venmo.com/" +
  "twitch.tv/videos/clips.twitch.tv/" +
  "steamcommunity.com/store.steampowered.com/app/" +
  "imdb.com/title/tt" +
  "open.spotify.com/" +

  // === COMMON URL PATH SEGMENTS ===
  "/search/watch/video/videos/photo/photos/image/images/post/posts/status/" +
  "/profile/user/users/account/settings/dashboard/admin/login/register/signup/" +
  "/blog/article/articles/news/category/categories/tag/tags/archive/" +
  "/product/products/item/items/shop/store/cart/checkout/order/orders/" +
  "/about/contact/help/faq/terms/privacy/policy/" +
  "/download/uploads/media/assets/static/public/" +
  "/share/embed/redirect/callback/auth/oauth/" +
  "/pl/en/de/fr/es/" +

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
  "z góry z dołu z boku z tyłu z przodu na górze na dole " +

  // === EXPANDED URL DOMAINS (most shared sites globally + PL) ===
  // Social / messaging
  "messenger.com/t/web.whatsapp.com/signal.group/" +
  "bsky.app/profile/mastodon.social/@" +
  "tumblr.com/post/quora.com/answer/" +

  // Video / streaming
  "vimeo.com/dailymotion.com/video/" +
  "twitch.tv/videos/clips.twitch.tv/crunchyroll.com/watch/" +
  "disneyplus.com/video/hbomax.com/player.vimeo.com/" +
  "primevideo.com/detail/" +

  // Music
  "open.spotify.com/track/open.spotify.com/album/open.spotify.com/playlist/" +
  "music.youtube.com/watch?v=soundcloud.com/deezer.com/track/" +
  "tidal.com/browse/track/music.apple.com/album/" +

  // News (PL)
  "wiadomosci.wp.pl/sport.wp.pl/kobieta.wp.pl/tech.wp.pl/" +
  "wiadomosci.onet.pl/sport.onet.pl/biznes.onet.pl/kultura.onet.pl/" +
  "tvn24.pl/polska/tvn24.pl/swiat/tvn24.pl/biznes/" +
  "wyborcza.pl/natemat.pl/noizz.pl/spidersweb.pl/" +
  "rmf24.pl/rmfon.pl/radio.zet.pl/polskieradio.pl/" +
  "pap.pl/depozyty.pl/next.gazeta.pl/" +
  "tokfm.pl/newsweek.pl/polityka.pl/wprost.pl/tygodnikpowszechny.pl/" +
  "dziennik.pl/fakt.pl/se.pl/przegladsportowy.pl/" +

  // Shopping (PL)
  "amazon.pl/dp/amazon.de/dp/amazon.com/dp/" +
  "zalando.pl/mediamarkt.pl/ikea.com/pl/" +
  "rossmann.pl/biedronka.pl/lidl.pl/auchan.pl/carrefour.pl/" +
  "decathlon.pl/hm.com/pl/zara.com/pl/" +
  "pepco.pl/action.pl/temu.com/pl/" +
  "aliexpress.com/item/" +

  // Tech / dev
  "npmjs.com/package/pypi.org/project/crates.io/crates/" +
  "hub.docker.com/r/packagist.org/packages/" +
  "dev.to/hashnode.dev/substack.com/p/" +
  "codepen.io/pen/codesandbox.io/s/" +
  "jsfiddle.net/replit.com/@" +
  "vercel.com/app.netlify.com/sites/" +
  "aws.amazon.com/console.cloud.google.com/portal.azure.com/" +
  "console.firebase.google.com/project/" +
  "supabase.com/dashboard/project/" +

  // Gaming
  "store.steampowered.com/app/epicgames.com/store/" +
  "gog.com/game/humblebundle.com/" +
  "nexusmods.com/mods/" +
  "pcgamer.com/kotaku.com/ign.com/" +
  "twitch.tv/directory/game/" +

  // Education / docs
  "developer.mozilla.org/docs/web.dev/" +
  "w3schools.com/css/w3schools.com/js/" +
  "learn.microsoft.com/docs/" +
  "cloud.google.com/docs/" +
  "react.dev/reference/nextjs.org/docs/" +
  "tailwindcss.com/docs/" +
  "typescriptlang.org/docs/" +

  // Finance / crypto
  "revolut.com/ing.pl/mbank.pl/pkobp.pl/santander.pl/" +
  "bnpparibas.pl/millenniumbcp.pl/aliorbank.pl/nestbank.pl/" +
  "coinmarketcap.com/currencies/coingecko.com/coins/" +
  "binance.com/trade/coinbase.com/price/" +
  "tradingview.com/chart/finance.yahoo.com/quote/" +

  // Travel
  "booking.com/hotel/airbnb.pl/rooms/" +
  "tripadvisor.com/skyscanner.pl/kayak.pl/" +
  "ryanair.com/wizzair.com/lot.com/" +
  "esky.pl/fly4free.pl/wakacje.pl/" +
  "google.com/travel/flights/google.com/travel/hotels/" +

  // Polish services
  "poczta-polska.pl/sledzenie/inpost.pl/szybkie-nadania/" +
  "paczkawruchu.pl/dpd.com.pl/tracking/" +
  "blablacar.pl/trip/jakdojade.pl/" +
  "otodom.pl/oferta/gratka.pl/nieruchomosci/" +
  "otomoto.pl/oferta/mobile.de/auto/" +
  "trojmiasto.pl/gdansk.pl/krakow.pl/wroclaw.pl/" +
  "nocowanie.pl/travelist.pl/" +

  // Food / delivery
  "pyszne.pl/menu/ubereats.com/store/glovo.com/" +
  "wolt.com/pl/restaurant/" +

  // Misc popular
  "linkedin.com/posts/linkedin.com/feed/update/" +
  "facebook.com/groups/facebook.com/events/facebook.com/marketplace/" +
  "instagram.com/p/instagram.com/reel/instagram.com/stories/" +
  "twitter.com/status/x.com/status/" +
  "reddit.com/r/comments/tiktok.com/video/" +
  "pinterest.com/pin/behance.net/gallery/" +
  "dribbble.com/shots/" +
  "producthunt.com/posts/" +
  "news.ycombinator.com/item?id=" +

  // Common URL query/hash patterns
  "?fbclid=&gclid=&gad_source=&gb.source=" +
  "?si=&feature=share&feature=youtu.be" +
  "#section-#heading-#tab-#comment-#reply- " +

  // === MORE POLISH WORDS (internet/tech slang, common texting) ===
  "hej siema elo nara dzieki dzięki spoko okej " +
  "sorki sory sorry lol xd haha " +
  "fajnie super extra ekstra git spox luz " +
  "napisz odpisz wyślij sprawdź zobacz pokaż " +
  "link linka strona stronę stronka " +
  "zdjęcie zdjęcia foto fotka filmik film " +
  "jutro dzisiaj wczoraj teraz zaraz później " +
  "dobra okej jasne no tak pewnie " +
  "spotkanie spotkamy spotkajmy się umówmy się " +
  "adres miejsce gdzie kiedy o której " +
  "numer telefon telefonu mail maila email " +
  "przelew konto konta pieniądze kasa hajs " +
  "polecam polecenie opinia recenzja ocena " +
  "promocja rabat kod zniżka wyprzedaż okazja " +
  "ogłoszenie oferta aukcja kupię sprzedam zamienię " +
  "praca oferta pracy stanowisko wynagrodzenie pensja " +
  "przepis składniki przygotowanie porcji minut godzin " +
  "bilet bilety rezerwacja termin wizyta umówić " +
  "lekarz dentysta apteka recepta badanie " +
  "mecz wynik tabela liga punkt gol " +
  "pogoda stopni deszcz śnieg słońce wiatr temperatura " +

  // === EVEN MORE POPULAR DOMAINS & PATHS ===
  // YouTube patterns (most shared)
  "youtube.com/watch?v=youtube.com/shorts/youtube.com/live/" +
  "youtube.com/playlist?list=youtube.com/clip/youtube.com/c/" +
  "youtu.be/m.youtube.com/watch?v=" +
  "&list=&index=&t=&ab_channel=&si=" +

  // Facebook patterns
  "facebook.com/share/facebook.com/reel/facebook.com/photo/" +
  "facebook.com/watch/facebook.com/story.php?story_fbid=" +
  "facebook.com/permalink.php?story_fbid=" +
  "m.facebook.com/fb.watch/fb.me/" +
  "web.facebook.com/l.facebook.com/" +

  // Instagram patterns
  "instagram.com/p/instagram.com/reel/instagram.com/tv/" +
  "instagram.com/stories/instagram.com/explore/" +
  "ddinstagram.com/" +

  // Twitter/X patterns
  "x.com/i/status/twitter.com/i/status/" +
  "x.com/search?q=twitter.com/hashtag/" +
  "x.com/home x.com/explore x.com/messages " +
  "t.co/vxtwitter.com/fixupx.com/" +
  "nitter.net/" +

  // TikTok patterns
  "tiktok.com/@/video/tiktok.com/t/" +
  "vm.tiktok.com/vt.tiktok.com/" +

  // Reddit patterns
  "reddit.com/r//comments//wiki/" +
  "old.reddit.com/r/new.reddit.com/r/" +
  "i.redd.it/v.redd.it/preview.redd.it/" +

  // Google services
  "calendar.google.com/event/mail.google.com/mail/" +
  "translate.google.com/?sl=&tl=" +
  "google.com/search?q=google.pl/search?q=" +
  "youtube.googleapis.com/news.google.com/" +
  "scholar.google.com/trends.google.com/trends/" +
  "sites.google.com/site/forms.google.com/forms/" +
  "photos.google.com/share/colab.research.google.com/" +
  "play.google.com/store/apps/" +

  // Microsoft services
  "outlook.live.com/mail/onedrive.live.com/" +
  "office.com/1drv.ms/" +
  "sharepoint.com/sites/dev.azure.com/" +
  "visualstudio.com/github.dev/" +

  // Apple services
  "icloud.com/testflight.apple.com/" +

  // Amazon / cloud
  "amazon.pl/s?k=amazon.de/s?k=amazon.com/s?k=" +
  "s3.amazonaws.com/cloudfront.net/" +

  // GitHub patterns (devs share these a lot)
  "github.com/issues/github.com/pull/" +
  "github.com/releases/tag/github.com/blob/main/" +
  "github.com/tree/main/github.com/commit/" +
  "github.com/actions/runs/github.com/discussions/" +
  "raw.githubusercontent.com/gist.github.com/" +
  "github.io/pages/" +

  // Notion / productivity
  "notion.site/www.notion.so/" +
  "trello.com/b/trello.com/c/" +
  "asana.com/app/clickup.com/t/" +
  "monday.com/boards/jira.atlassian.net/browse/" +
  "confluence.atlassian.net/wiki/" +
  "miro.com/app/board/airtable.com/" +
  "linear.app/issue/" +

  // Design
  "figma.com/design/figma.com/proto/" +
  "canva.com/design/sketch.com/s/" +
  "adobe.com/products/creativecloud.adobe.com/" +

  // AI tools
  "chat.openai.com/c/chatgpt.com/c/" +
  "claude.ai/chat/poe.com/chat/" +
  "bard.google.com/chat/copilot.microsoft.com/" +
  "midjourney.com/app/labs.openai.com/" +
  "perplexity.ai/search/" +
  "huggingface.co/spaces/" +

  // Polish news expanded
  "onet.pl/informacje/onetvideo/" +
  "sport.tvp.pl/tvp.info/tvp.pl/video/" +
  "businessinsider.com.pl/300gospodarka.pl/" +
  "money.pl/gospodarka/money.pl/gielda/" +
  "bankier.pl/wiadomosc/forsal.pl/" +
  "benchmark.pl/testy/purepc.pl/test/" +
  "komputerswiat.pl/antyweb.pl/niebezpiecznik.pl/" +
  "dobreprogramy.pl/instalki.pl/" +
  "chip.pl/geekweek.pl/telepolis.pl/" +

  // Polish forums / communities
  "wykop.pl/link/wykop.pl/wpis/" +
  "reddit.com/r/Polska/reddit.com/r/poland/" +
  "forum.gazeta.pl/forum.wp.pl/" +
  "elektroda.pl/forumowisko.pl/" +
  "tabletowo.pl/gsmmaniak.pl/" +

  // Polish services expanded
  "e-pity.pl/pit.pl/podatki.gov.pl/" +
  "ceidg.gov.pl/krs-online.com.pl/regon.stat.gov.pl/" +
  "epuap2.mswia.gov.pl/praca.gov.pl/" +
  "nfz.gov.pl/zus.gov.pl/pfr.pl/" +
  "uokik.gov.pl/ure.gov.pl/" +
  "bip.gov.pl/sejm.gov.pl/senat.gov.pl/" +
  "pkp.pl/intercity.pl/koleo.pl/rozklad-pkp.pl/" +
  "ztm.waw.pl/mpk.krakow.pl/mpk.wroclaw.pl/" +
  "jakdojade.pl/skycash.com/" +

  // Polish banks
  "ipko.pl/online.mbank.pl/ing.pl/mojeing/" +
  "centrum24.pl/millenniumbank.pl/" +
  "connect.bzwbk.pl/neobank.pl/" +
  "credit-agricole.pl/velobank.pl/" +
  "bnpparibas.pl/goonline/" +

  // Polish entertainment
  "player.pl/cda.pl/video/zalukaj.com/" +
  "filmweb.pl/film/filmweb.pl/serial/" +
  "lubimyczytac.pl/ksiazka/" +
  "empik.com/audiobooki/storytel.com/pl/" +
  "spotify.com/show/podcasty.onet.pl/" +
  "polsatboxgo.pl/hbo.pl/canal-plus.com/" +

  // URL shorteners (people paste these)
  "bit.ly/tinyurl.com/goo.gl/ow.ly/t.ly/" +
  "rb.gy/is.gd/v.gd/cutt.ly/shorturl.at/" +
  "lnkd.in/amzn.to/amzn.eu/" +

  // File sharing
  "drive.google.com/file/d/docs.google.com/document/" +
  "wetransfer.com/downloads/we.tl/" +
  "dropbox.com/s/dropbox.com/scl/" +
  "mediafire.com/file/mega.nz/file/" +
  "sendspace.com/file/" +

  // Payments
  "paypal.me/revolut.me/blik.pl/" +
  "zrzutka.pl/buycoffee.to/patronite.pl/" +
  "tipply.pl/buymeacoffee.com/" +

  // Maps
  "google.com/maps/place/google.com/maps/@" +
  "goo.gl/maps/maps.app.goo.gl/" +
  "openstreetmap.org/waze.com/ul/" +
  "targeo.pl/mapa/mapy.cz/" +

  // Common path patterns & file extensions
  ".html.htm.php.asp.aspx.jsp.json.xml.css.js.ts.tsx.jsx.py.rb.go.rs.java.cpp.c.h " +
  ".jpg.jpeg.png.gif.webp.svg.mp4.webm.mp3.wav.pdf.doc.docx.xls.xlsx.ppt.pptx.zip.rar " +
  "/page//p//id//post//article//item//product//view//detail//show/ " +

  // Common Polish chat patterns
  "możesz mi przesłać możesz wysłać podaj mi daj mi " +
  "sprawdź to zobacz to kliknij tutaj wejdź tutaj " +
  "mam pytanie mam problem potrzebuję pomocy " +
  "o co chodzi w czym rzecz co to jest jak to działa " +
  "ile kosztuje gdzie kupić skąd to jest " +
  "co myślisz co sądzisz jak uważasz " +
  "daj znać napisz mi odezwij się zadzwoń " +
  "pozdrawiam pozdro trzymaj się miłego dnia " +
  "dzięki wielkie dziękuję bardzo wielkie dzięki " +
  "nie ma sprawy spoko luz nie ma problemu " +
  "rozumiem wiem o czym mówisz zgadza się dokładnie właśnie " +
  "niestety nie da się niestety nie mogę nie jestem pewien " +
  "a propos swoją drogą przy okazji nawiasem mówiąc " +
  "wydaje mi się chyba raczej prawdopodobnie być może " +

  // === EVEN MORE DOMAINS (long tail, commonly shared) ===
  // Streaming / content
  "twitch.tv/popout/kick.com/rumble.com/v/" +
  "bilibili.com/video/niconico.jp/" +
  "archive.org/details/web.archive.org/web/" +

  // Ecommerce international
  "etsy.com/listing/wish.com/product/" +
  "shein.com/shopee.pl/lazada.com/" +

  // Jobs (PL)
  "pracuj.pl/praca/olx.pl/praca/" +
  "indeed.com/viewjob?jk=justjoin.it/offers/" +
  "nofluffjobs.com/pl/job/bulldogjob.pl/" +
  "theprotocol.it/praca/rocket-jobs.pl/" +
  "goldenline.pl/praca/" +

  // Real estate (PL)
  "otodom.pl/pl/oferta/morizon.pl/oferta/" +
  "domiporta.pl/nieruchomosci/" +
  "nieruchomosci-online.pl/szukaj/" +

  // Cars (PL)
  "otomoto.pl/osobowe/otomoto.pl/ciezarowe/" +
  "mobile.de/pl/samochod/" +
  "autocentrum.pl/autokult.pl/" +

  // Health
  "znanylekarz.pl/wizyta/docplanner.com/" +
  "medonet.pl/mp.pl/medycyna/" +
  "aptekagemini.pl/doz.pl/" +

  // Education (PL)
  "pl.wikipedia.org/wiki/" +
  "wolnelektury.pl/katalog/" +
  "edukacja.gov.pl/men.gov.pl/" +
  "coursera.org/learn/udemy.com/course/" +
  "skillshare.com/classes/edx.org/learn/" +
  "khanacademy.org/humanities/" +

  // Crypto / NFT
  "etherscan.io/tx/etherscan.io/address/" +
  "opensea.io/assets/rarible.com/token/" +
  "uniswap.org/swap/pancakeswap.finance/" +
  "dextools.io/app/ether/pair-explorer/" +

  // Stack Overflow / dev communities
  "stackoverflow.com/questions/stackoverflow.com/a/" +
  "askubuntu.com/questions/serverfault.com/questions/" +
  "superuser.com/questions/stackexchange.com/" +
  "github.com/orgs//repos/github.com/topics/" +

  // Cloud / hosting
  "dashboard.heroku.com/apps/" +
  "console.aws.amazon.com/railway.app/" +
  "render.com/web/fly.io/apps/" +
  "digitalocean.com/projects/" +

  // CMS / blogs
  "wordpress.com/post/medium.com/p/" +
  "ghost.io/substack.com/p/" +
  "blogger.com/blog/post/" +
  "wix.com/squarespace.com/" +

  // Misc tools
  "regex101.com/r/crontab.guru/#" +
  "excalidraw.com/jsonformatter.org/" +
  "carbon.now.sh/ray.so/" +
  "pagespeed.web.dev/analysis/" +
  "gtmetrix.com/reports/" +

  // PL government / public services expanded
  "obywatel.gov.pl/usluga/biznes.gov.pl/opisy-procedur/" +
  "podatki.gov.pl/e-deklaracje/" +
  "komornik.pl/sad.gov.pl/" +
  "bdo.mos.gov.pl/geoportal.gov.pl/" +
  "gun.gov.pl/gis.gov.pl/" +
  "stat.gov.pl/obszary-tematyczne/" +
  "policja.gov.pl/straz.gov.pl/" +

  // Sports (PL)
  "sport.pl/pilka-nozna/sport.pl/ekstraklasa/" +
  "meczyki.pl/transfermarkt.com/transfermarkt.pl/" +
  "flashscore.pl/mecze/livescore.com/" +
  "eurosport.pl/sport.tvp.pl/" +
  "sportowefakty.wp.pl/" +

  // Cooking / recipes (PL)
  "kwestiasmaku.com/przepis/przepisy.pl/" +
  "aniagotuje.pl/mojewypieki.com/" +
  "przyslijprzepis.pl/gotujmy.pl/" +

  // DIY / home (PL)
  "leroymerlin.pl/castorama.pl/obi.pl/" +
  "brw.com.pl/ikea.com/pl/pl/" +
  "agata.pl/black-red-white.pl/" +

  // Fashion (PL)
  "zalando.pl/moda/reserved.com/pl/" +
  "sinsay.com/pl/mohito.com/pl/housebrand.com/pl/" +
  "answear.com/pl/modivo.pl/" +
  "eobuwie.com.pl/ccc.eu/pl/" +

  // Common HTTP / web patterns
  "/login/register/signup/forgot-password/reset-password/ " +
  "/dashboard/profile/settings/notifications/messages/inbox/ " +
  "/feed/trending/explore/discover/popular/latest/new/ " +
  "/checkout/payment/shipping/confirmation/tracking/ " +
  "?page=1&per_page=&limit=&offset=&cursor= " +
  "?sort=newest&sort=popular&sort=price " +
  "&category=&brand=&color=&size=&min_price=&max_price= " +

  // More Polish everyday words
  "dzisiaj wieczorem jutro rano wczoraj w nocy w weekend w piątek w sobotę " +
  "przed po między około koło naprzeciwko obok wzdłuż " +
  "chodzi o chodzi mi o chodzi nam o wiesz co mówię " +
  "dobra robota świetna robota brawo gratulacje " +
  "wszystkiego najlepszego sto lat wesołych świąt " +
  "smacznego na zdrowie powodzenia trzymam kciuki " +
  "przepraszam za spóźnienie przepraszam za kłopot " +
  "odezwę się wrócę do ciebie dam ci znać " +
  "zapisz sobie zapamiętaj pamiętaj zanotuj " +
  "weź spójrz zerknij na to rzuć okiem " +
  "co powiesz na jak ci się podoba " +
  "za dużo za mało wystarczy w sam raz " +
  "nie ma sensu warto spróbować daj spokój " +
  "chodzi o to że problem polega na " +
  "najważniejsze to przede wszystkim kluczowe jest " +

  // === FILL REMAINING ~5KB ===
  // More Polish popular sites
  "pepper.pl/promocje/hotdeals.pl/" +
  "x-kom.pl/p/morele.net/podzespoly/" +
  "komputronik.pl/produkt/proline.pl/" +
  "euro.com.pl/neonet.pl/" +
  "sfd.pl/forum/bodybuilding.pl/" +
  "wizytowka.rzetelnafirma.pl/" +
  "panoramafirm.pl/pkt.pl/" +

  // URL encoded Polish chars (sometimes in URLs)
  "%C4%85%C4%87%C4%99%C5%82%C5%84%C3%B3%C5%9B%C5%BA%C5%BC" +
  "%C4%84%C4%86%C4%98%C5%81%C5%83%C3%93%C5%9A%C5%B9%C5%BB " +

  // More social media / messaging patterns
  "instagram.com/direct/instagram.com/accounts/edit/" +
  "facebook.com/profile.php?id=facebook.com/friends/" +
  "facebook.com/notifications/facebook.com/bookmarks/" +
  "twitter.com/settings/twitter.com/notifications/" +
  "linkedin.com/messaging/linkedin.com/notifications/" +
  "linkedin.com/jobs/view/linkedin.com/pulse/" +

  // Stack / tech docs
  "docs.github.com/en/api.github.com/repos/" +
  "registry.npmjs.org/cdn.jsdelivr.net/npm/" +
  "unpkg.com/cdnjs.cloudflare.com/ajax/libs/" +
  "fonts.googleapis.com/css2?family=" +
  "fonts.gstatic.com/" +

  // More common Polish verbs / expressions
  "potrzebować potrzebuję potrzebujesz potrzebuje potrzebujemy potrzebujecie potrzebują " +
  "powinien powinna powinno powinni powinny powinniśmy powinniście " +
  "wygląda wyglądasz wyglądają wyglądam " +
  "zgadzam się nie zgadzam się masz rację nie masz racji " +
  "zależy mi na ważne jest żeby chciałbym chciałabym " +
  "mógłbyś mogłabyś mógłby mogłaby moglibyśmy " +
  "powinienem powinnam powinieneś powinnaś " +
  "obiecuję obiecujesz obiecuje obiecują " +
  "pamiętam pamiętasz pamięta pamiętamy pamiętają " +
  "zapomniałem zapomniałam zapomniałeś zapomniałaś " +
  "martwie się martwię się nie martw się " +
  "cieszę się cieszysz się cieszy mnie " +
  "przepraszam za przepraszamy za " +
  "gratuluję gratulujemy gratulacje z okazji " +
  "życzę życzenia najlepsze życzenia " +

  // Tech / programming terms (shared in dev contexts)
  "function const let var return import export " +
  "async await promise resolve reject " +
  "error warning debug info log " +
  "undefined null true false " +
  "component render state props " +
  "request response status code " +
  "database table query select insert update delete " +
  "server client api endpoint route " +
  "config env production development staging " +
  "deploy build test lint format " +
  "branch commit push pull merge rebase " +
  "docker container image volume network " +
  "version release changelog update upgrade " +

  // === FINAL ~4KB ===
  // More URL-encoded common chars
  "%20%2F%3A%3F%3D%26%23%25%40%2B " +

  // Popular link patterns with IDs/hashes
  "/watch?v=/status//p//reel//video//shorts//clip/ " +
  "/file/d//folders//document/d//spreadsheets/d//presentation/d/ " +

  // WhatsApp / Telegram
  "wa.me/api.whatsapp.com/send?phone=" +
  "t.me/s/t.me/c/t.me/joinchat/" +

  // Spotify full patterns
  "open.spotify.com/intl-pl/track/" +
  "open.spotify.com/intl-pl/album/" +
  "open.spotify.com/intl-pl/playlist/" +
  "open.spotify.com/intl-pl/artist/" +
  "open.spotify.com/intl-pl/show/" +
  "open.spotify.com/intl-pl/episode/" +

  // Google extended
  "accounts.google.com/calendar.google.com/calendar/" +
  "classroom.google.com/c/keep.google.com/" +
  "myaccount.google.com/security/" +
  "google.com/maps/dir/google.com/maps/search/" +
  "earth.google.com/web/" +

  // More PL shopping
  "abcdzwoni.pl/sferis.pl/neonet.pl/oleole.pl/" +
  "electro.pl/megamarket.pl/" +
  "smyk.com/toysrus.pl/5-10-15.pl/" +
  "drogeriapigment.pl/hebe.pl/natura.pl/" +
  "apart.pl/w-kruk.pl/pandora.net/pl/" +

  // More common Polish phrases (texting)
  "daj mi znać jak będziesz gotowy " +
  "zadzwoń do mnie jak będziesz mógł " +
  "wyślij mi to na maila " +
  "spotkajmy się o godzinie " +
  "czy możesz mi pomóc z " +
  "nie mogę się doczekać " +
  "jak ci idzie z co u ciebie " +
  "miłego weekendu miłego wieczoru " +
  "do usłyszenia do napisania " +
  "trzymaj się cieplutko " +
  "buziaki buziak całuski pozdrawiam serdecznie " +
  "z pozdrowieniami z wyrazami szacunku " +
  "w załączeniu przesyłam w nawiązaniu do " +
  "dziękuję za szybką odpowiedź " +
  "czekam na odpowiedź proszę o kontakt "
);
