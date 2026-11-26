import { Book } from '../types/library';

export const LIBRARY_BOOKS: Book[] = [
  {
    id: 'lentera-awan-pagi',
    title: 'Lentera di Atas Awan Pagi',
    author: 'Nadia Kirana',
    year: 2025,
    category: 'Dongeng & Fantasi',
    pages: 148,
    readingMinutes: 18,
    totalCopies: 4,
    coverImage: '/src/assets/images/cover_lantern_sky_1795677568281.jpg',
    coverMotif: 'lantern',
    accentTone: 'blue',
    synopsis:
      'Kisah penjaga lentera langit yang menuntun bangau kertas pulang setiap fajar menyingsing di kota awan pastel.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Menara Kaca di Lembah Embun',
        subtitle: 'Saat angin timur membawa pesan pertama',
        pullQuote:
          'Setiap bangau kertas menyimpan satu janji kecil yang dilipat rapi oleh tangan yang rindu.',
        paragraphs: [
          'Di tepi selatan Kota Awan, tempat awan cumulus menggantung serendah atap gerai roti, berdirilah menara kaca milik Lira. Setiap subuh sebelum lonceng biru berdentang, ia menyalakan sumbu lentera beraroma melati dan mengikatkan pita merah jambu di pegangannya.',
          'Tugasnya terdengar sederhana: menjaga agar bangau-bangau kertas yang diterbangkan penduduk bumi tidak tersesat saat melewati kabut fajar. Namun pagi itu, seekor bangau berwarna biru pucat mendarat tepat di ambang jendelanya dengan sayap sedikit basah oleh hujan bintang.',
          'Lira mengeringkan sayap kertas itu dengan napas hangat dan membaca tulisan halus di lipatan lehernya. Tertulis sebuah alamat yang tidak pernah tercantum dalam peta angin mana pun: Taman Porselen di Balik Pelangi Ketiga.',
          'Sambil mengenakan mantel wol tipisnya, Lira menggantungkan lentera kaca ke tongkat kayu ek. Perjalanan mencari penerima pesan itu baru saja dimulai, tepat ketika langit berubah dari biru lembut menjadi merah jambu muda.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Pelabuhan Pita dan Angin Selatan',
        subtitle: 'Menyeberangi jembatan kapas putih',
        pullQuote:
          'Hal-hal yang rapuh bukan berarti lemah; kertas justru sanggup terbang lebih jauh daripada batu.',
        paragraphs: [
          'Di Pelabuhan Pita, para pembuat layang-layang sedang menenun benang sutra berwarna pastel ke tiang dermaga. Seorang kakek berkacamata bulat mengenali cap lilin di sayap bangau milik Lira.',
          'Menurut sang kakek, dua puluh musim lalu ada seorang perajin teh yang selalu mengirim catatan ucapan terima kasih menggunakan bangau biru setiap kali panen chamomile berhasil. Namun sejak rumah tehnya pindah ke bukit atas, tak ada lagi surat yang sampai.',
          'Dengan bantuan perahu layar mini bermuatan bantal awan, Lira berlayar perlahan menyusuri arus udara tenang. Di kanan kirinya, buku-buku catatan milik para musafir melayang pelan seperti daun musim gugur yang enggan jatuh.',
          'Menjelang tengah hari, cahaya lentera di tangan Lira bergetar lembut—pertanda taman porselen yang ia cari hanya berjarak beberapa kepak sayap lagi.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Teh Hangat di Teras Porselen',
        subtitle: 'Tempat setiap surat menemukan rumahnya',
        pullQuote:
          'Pulang adalah saat seseorang menyisakan satu cangkir hangat hanya untukmu.',
        paragraphs: [
          'Rumah teh itu ternyata tersembunyi di balik pagar bunga lavender yang mekar sepanjang tahun. Asap tipis beraroma vanila mengepul dari cerobong mungilnya, membentuk cincin-cincin kecil di udara biru.',
          'Ketika Lira menyerahkan bangau kertas biru tersebut, seorang nenek tersenyum dengan mata berkaca-kaca. Itu adalah surat dari cucunya di kota bawah yang baru saja membuka toko buku kecil pertama mereka.',
          'Sebagai ucapan terima kasih, sang nenek menyeduhkan teh bunga telang yang perlahan berubah warna menjadi merah jambu lembut ketika ditetesi perasan jeruk manis. Lira menuliskan catatan di buku sakunya, lalu bergegas pulang sebelum senja turun.',
          'Malam itu, di atas menara kaca, lentera Lira bersinar lebih tenang daripada biasanya—karena ia tahu, tidak ada pesan baik yang pernah benar-benar tersesat.',
        ],
      },
    ],
  },
  {
    id: 'pondok-cangkir-lavender',
    title: 'Pondok Cangkir di Kebun Lavender',
    author: 'Senja Larasati',
    year: 2026,
    category: 'Fiksi Hangat',
    pages: 192,
    readingMinutes: 22,
    totalCopies: 3,
    coverImage: '/src/assets/images/cover_tea_garden_1795677568205.jpg',
    coverMotif: 'teacup',
    accentTone: 'pink',
    synopsis:
      'Catatan harian seorang pustakawan keliling yang membuka kedai baca mungil di dalam pondok berbentuk cangkir porselen.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Pintu Kayu dan Aroma Roti Kayu Manis',
        subtitle: 'Hari pertama membuka rak bacaan kebun',
        pullQuote:
          'Buku yang tepat tidak datang dengan tergesa; ia menunggu hingga hatimu cukup hening untuk mendengarnya.',
        paragraphs: [
          'Pondok itu memang tidak lebih besar dari ruang tamu biasa, namun dinding lengkungnya dilukis motif mawar merah jambu dan dedaunan biru muda seperti cangkir porselen antik warisan nenek. Di atap jeraminya, bunga-bunga liar tumbuh bebas menyambut kupu-kupu pagi.',
          'Miko menata tiga puluh buku pilihan di rak kayu pinus dekat jendela melengkung. Setiap pengunjung yang datang boleh meminjam satu buku selama tujuh hari, dengan satu syarat unik: menuliskan satu kalimat kesan di pembatas buku kertas.',
          'Pengunjung pertamanya pagi itu adalah seorang pelukis cat air yang sedang kehilangan warna favoritnya. Ia duduk di bangku taman sambil memeluk lutut, memandang hamparan lavender yang bergoyang ditiup angin.',
          'Miko menyodorkan sebuah buku bersampul biru langit dan secangkir cokelat hangat. Belum genap dua bab dibaca, senyum tipis kembali muncul di wajah sang pelukis.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Kartu Peminjaman Berpinggir Renda',
        subtitle: 'Rahasia menjaga janji waktu bersama pembaca',
        pullQuote:
          'Keteraturan bukan musuh imajinasi; ia justru pagar yang menjaga kebun cerita tetap terawat.',
        paragraphs: [
          'Agar tidak ada buku yang hilang ditelan kesibukan kota, Miko membuat kotak kartu peminjaman kecil berwarna biru pastel. Setiap kartu memiliki penanda tanggal kembali dan pita kecil yang berbunyi gemerincing halus bila tersentuh angin.',
          'Ketika seorang pengunjung lupa mengembalikan buku kumpulan resep kue bulan, Miko tidak marah. Ia justru mengirimi kartu pos bergambar cangkir teh sebagai pengingat ramah.',
          'Keesokan paginya, si peminjam datang membawa buku itu kembali bersama sekotak kue kering stroberi. Sejak hari itu, pengingat lembut menjadi tradisi paling disukai di Kebun Lavender.',
          'Para pembaca menyadari bahwa mengembalikan buku tepat waktu memberi kesempatan bagi orang lain untuk merasakan kehangatan cerita yang sama.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Lampu Kuning saat Senja',
        subtitle: 'Bab penutup musim semi',
        pullQuote:
          'Setiap halaman yang selesai dibaca menanam satu kunang-kunang baru di halaman belakang.',
        paragraphs: [
          'Menjelang malam, kunang-kunang mulai bermunculan dari sela-sela semak lavender, menyala serempak seperti bintang jatuh yang tersangkut di rerumputan. Cahaya hangat dari jendela pondok cangkir memantul di embun sore.',
          'Miko merapikan kembali pembatas buku yang penuh tulisan tangan para tetangga. Ada yang menulis tentang keberanian memulai pekerjaan baru, ada pula yang sekadar bersyukur karena hari itu hujan turun tepat waktu.',
          'Sebelum mengunci pintu kayu melengkung itu, ia memeriksa jadwal pengembalian untuk esok hari dan menyiapkan dua buku baru untuk dipajang di meja depan.',
        ],
      },
    ],
  },
  {
    id: 'kompas-bintang-kapas',
    title: 'Kompas Bintang & Jam Awan',
    author: 'Raka Pratama',
    year: 2025,
    category: 'Sains & Alam',
    pages: 214,
    readingMinutes: 25,
    totalCopies: 5,
    coverImage: '/src/assets/images/cover_clockwork_cloud_1795677568616.jpg',
    coverMotif: 'astrolabe',
    accentTone: 'blue',
    synopsis:
      'Pengantar astronomi puitis dan ilmu cuaca tentang bagaimana bulan, awan, dan rasi bintang menjaga ritme waktu kita.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Mengukur Waktu dari Bulan Sabit',
        subtitle: 'Bagaimana langit menjadi kalender tertua manusia',
        pullQuote:
          'Langit malam adalah perpustakaan yang sampulnya selalu terbuka setiap kali lampu kota dipadamkan.',
        paragraphs: [
          'Jauh sebelum jam tangan berdetak di pergelangan manusia, para pelaut dan penyair menengadah ke langit untuk membaca waktu. Bulan sabit yang muncul di ufuk barat menandai awal babak baru, sementara purnama mengingatkan saatnya berkumpul.',
          'Astrolab kuningan—alat ukur bintang klasik berbentuk cakram berukir—memungkinkan pengamat memetakan posisi bintang terang hanya dengan mengarahkan jarum penunjuknya ke cakrawala.',
          'Menariknya, warna langit senja yang sering berubah menjadi gradasi biru pastel dan merah jambu bukan sekadar kebetulan puitis. Fenomena hamburan Rayleigh menyaring cahaya biru di siang hari dan membiarkan spektrum merah muda menyapu awan tinggi saat matahari rendah.',
          'Dengan memahami ritme cahaya ini, kita belajar bahwa ilmu pengetahuan dan keindahan selalu berjalan berdampingan.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Anatomi Awan Tinggi',
        subtitle: 'Cirrus, altostratus, dan pelangi fajar',
        pullQuote:
          'Awan tidak pernah terburu-buru melintasi benua, namun mereka selalu tiba tepat pada musimnya.',
        paragraphs: [
          'Di ketinggian enam hingga sepuluh kilometer di atas permukaan laut, uap air membeku menjadi kristal es mikroskopis yang membentuk awan cirrus tipis bak guratan kuas di atas kanvas biru.',
          'Ketika matahari terbit atau tenggelam, kristal es tersebut memantulkan rona persik dan merah jambu lembut ke seluruh penjuru langit. Para pengamat cuaca kuno menjadikannya pertanda perubahan tekanan udara yang tenang.',
          'Jika kamu mengamati langit pagi selama lima menit setiap hari, kamu akan mulai mengenali pola angin tanpa perlu melihat layar prakiraan cuaca.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Menjaga Ritme Harian',
        subtitle: 'Pelajaran keteraturan dari orbit tata surya',
        pullQuote:
          'Keteraturan semesta memberi kita ruang aman untuk bermimpi tanpa tersesat.',
        paragraphs: [
          'Planet-planet tidak pernah melompati lintasannya, dan pasang surut laut selalu menepati jadwal bulan. Keteraturan ini bukan bentuk kekakuan, melainkan tarian paling presisi di alam semesta.',
          'Dalam kehidupan sehari-hari, mencatat jadwal kecil—kapan memulai, kapan beristirahat, dan kapan mengembalikan apa yang kita pinjam—adalah cara manusia meniru keharmonisan bintang-bintang tersebut.',
        ],
      },
    ],
  },
  {
    id: 'perahu-kertas-ombak-malam',
    title: 'Perahu Kertas di Ombak Malam',
    author: 'Tara Ayuningtyas',
    year: 2026,
    category: 'Puisi & Esai',
    pages: 120,
    readingMinutes: 15,
    totalCopies: 4,
    coverImage: '/src/assets/images/cover_letter_waves_1795677569151.jpg',
    coverMotif: 'waves',
    accentTone: 'blue',
    synopsis:
      'Kumpulan esai lirih dan prosa pendek tentang surat-surat yang tak sempat terkirim dan laut biru yang memantulkan cahaya bintang.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Lipatan Pertama: Tentang Keberanian',
        subtitle: 'Catatan dari dermaga kayu tua',
        pullQuote:
          'Ada kalimat yang terlalu lembut untuk diucapkan keras-keras, maka kita melipatnya menjadi perahu kertas.',
        paragraphs: [
          'Ketika malam terlalu sunyi dan lampu dermaga memantulkan cahaya keemasan di permukaan laut, melipat selembar kertas surat menjadi perahu kecil terasa seperti mengembalikan kenangan ke tempat asalnya.',
          'Setiap lipatan diagonal menuntut ketelitian. Jika sudutnya miring sedikit saja, perahu tidak akan seimbang saat menyentuh riak air. Begitu pula hidup: sering kali ketenangan lahir dari perhatian kita pada detail-detail kecil.',
          'Di atas ombak biru keunguan, lentera mungil di haluan perahu kertas tampak seperti kunang-kunang yang berlayar menuju pulau seberang.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Cap Lilin Merah Jambu',
        subtitle: 'Menjaga kehangatan korespondensi',
        pullQuote:
          'Menulis tangan memperlambat pikiran hingga kita sanggup mendengar detak hati sendiri.',
        paragraphs: [
          'Dahulu, orang menunggu berhari-hari hanya untuk menerima selembar amplop bersegel lilin merah muda. Penantian itu membuat setiap kata terasa berharga dan tidak mudah dilupakan.',
          'Di era serba cepat hari ini, membaca sebuah buku utuh dari halaman pertama hingga terakhir adalah cara kita menghadiahi diri sendiri kesabaran yang sama.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Pelabuhan Fajar',
        subtitle: 'Saat semua perahu kembali ke tepian',
        pullQuote:
          'Tidak ada perjalanan malam yang sia-sia jika ia mengantarkanmu pulang dengan hati yang lebih lapang.',
        paragraphs: [
          'Ketika bintang-bintang perlahan memudar di balik kabut pagi, laut berubah warna menjadi biru pastel yang jernih. Perahu-perahu kertas menepi di pasir putih, membawa pulang cerita dari sisi teluk yang lain.',
          'Tutup buku ini perlahan, tarik napas dalam, dan sambut pagimu dengan senyum yang tenang.',
        ],
      },
    ],
  },
  {
    id: 'katalog-botani-pita-sutra',
    title: 'Herbarium Pita & Bunga Tekan',
    author: 'Dinda Melati',
    year: 2024,
    category: 'Sains & Alam',
    pages: 164,
    readingMinutes: 20,
    totalCopies: 3,
    coverMotif: 'botanical',
    accentTone: 'pink',
    synopsis:
      'Panduan artistik mengawetkan bunga liar di antara halaman buku tebal beserta cerita botani di balik kelopak pastel.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Seni Mengeringkan Kelopak Sakura Lokal',
        subtitle: 'Memilih kertas penyerap dan pemberat buku',
        pullQuote:
          'Bunga yang ditekan di antara halaman kamus tetap menyimpan sinar matahari musim panas yang lalu.',
        paragraphs: [
          'Mengumpulkan bunga liar di pagi hari setelah embun menguap adalah langkah pertama membuat herbarium rumah. Pilihlah kelopak yang masih segar dan tidak terlalu tebal agar warnanya tidak mudah memudar.',
          'Sisipkan bunga di antara dua lembar kertas serap bebas asam, lalu tumpuk di bawah tiga buku bersampul keras selama dua minggu penuh.',
          'Setelah kering sempurna, ikat tangkainya dengan pita satin tipis berwarna biru muda atau merah jambu di atas kertas katun.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Pigmen Alami Kelopak Pastel',
        subtitle: 'Mengapa antosianin berubah warna bersama pH',
        pullQuote:
          'Setiap warna bunga adalah surat kimia rahasia antara tanah, hujan, dan cahaya.',
        paragraphs: [
          'Warna biru dan merah jambu pada bunga hortensia berasal dari senyawa pigmen bernama antosianin. Pada tanah yang sedikit asam, kelopak mekar dalam nuansa biru langit yang jernih; pada tanah yang lebih basa, warnanya bergeser menuju merah jambu hangat.',
          'Memahami rahasia kecil ini membuat kebun rumah terasa seperti laboratorium dongeng yang hidup.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Menyimpan Kenangan di Halaman Terakhir',
        subtitle: 'Etika meminjam buku yang berisi pembatas bunga',
        pullQuote:
          'Pembatas buku paling manis adalah yang meninggalkan kisah tanpa merusak kertas.',
        paragraphs: [
          'Jangan lupa melaminasi tipis bunga tekanmu sebelum menjadikannya pembatas buku pinjaman, agar serbuk sari tidak menempel pada halaman yang akan dibaca peminjam berikutnya.',
        ],
      },
    ],
  },
  {
    id: 'toko-roti-awan-manis',
    title: 'Toko Roti di Ujung Pelangi',
    author: 'Bima Sakti Putra',
    year: 2025,
    category: 'Fiksi Hangat',
    pages: 176,
    readingMinutes: 21,
    totalCopies: 4,
    coverMotif: 'ribbon',
    accentTone: 'pink',
    synopsis:
      'Setiap pagi, seorang pembuat roti menguleni adonan brioche dengan cerita penduduk kota yang ditukar dengan sepotong roti hangat.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Oven Tembaga Berwarna Merah Muda',
        subtitle: 'Resep rahasia ragi pagi',
        pullQuote:
          'Roti terbaik membutuhkan dua hal: mentega yang sabar dan obrolan yang tulus.',
        paragraphs: [
          'Pukul lima tepat, lonceng pintu Toko Roti Pelangi berbunyi ringan menyambut angin subuh. Di etalase kaca berbingkai biru pastel, deretan roti susu lembut berjajar rapi bersama tart buah beri.',
          'Pemiliknya, Kael, punya kebiasaan unik: siapa pun yang datang sebelum pukul tujuh boleh membayar sepotong roti dengan menceritakan satu kejadian lucu yang mereka alami minggu ini.',
          'Buku catatan resep Kael pun perlahan berubah menjadi arsip kebahagiaan seluruh lingkungan.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Pita Pembungkus Kotak Kue',
        subtitle: 'Seni mengikat simpul yang mudah dibuka',
        pullQuote:
          'Simpul yang baik cukup kuat untuk menjaga isinya, namun cukup ramah untuk dilepas tanpa gunting.',
        paragraphs: [
          'Kael belajar mengikat pita dua warna—biru langit dan merah jambu—dari ibunya. Satu tarikan lembut di ujung kanan langsung melepaskan ikatan tanpa merusak kardus.',
          'Menurutnya, cara kita membungkus sesuatu menunjukkan seberapa besar kita menghargai orang yang menerimanya.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Sarapan Bersama Tukang Pos',
        subtitle: 'Ketika semua cerita bertemu di satu meja',
        pullQuote:
          'Kehangatan selalu berlipat ganda setiap kali dibagi dua.',
        paragraphs: [
          'Pada hari Minggu yang cerah, meja bundar di depan toko penuh oleh tawa para tetangga. Sepiring besar roti gulung kayu manis habis dalam sekejap, meninggalkan remah gula halus dan rasa syukur yang panjang.',
        ],
      },
    ],
  },
  {
    id: 'dongeng-penjahit-bulan',
    title: 'Penjahit Selimut Bulan Purnama',
    author: 'Clarissa Putri',
    year: 2024,
    category: 'Dongeng & Fantasi',
    pages: 138,
    readingMinutes: 17,
    totalCopies: 3,
    coverMotif: 'moon',
    accentTone: 'blue',
    synopsis:
      'Dongeng pengantar tidur tentang penjahit malam yang menambal awan robek dengan benang perak dan perca sutra biru.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Benang Perak dari Sinar Rembulan',
        subtitle: 'Bengkel jahit di balik menara jam',
        pullQuote:
          'Mimpi indah lahir dari selimut yang dijahit tanpa rasa terburu-buru.',
        paragraphs: [
          'Ketika semua penduduk desa terlelap, Soren membuka kotak jahit kayunya. Di dalamnya terdapat gulungan benang perak yang hanya bisa dipintal saat bulan purnama bersinar terang.',
          'Tugasnya setiap malam adalah menambal awan-awan tidur yang tersangkut di puncak pohon cemara agar tidak ada mimpi anak-anak yang tercecer sebelum pagi.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Perca Kain Perca Langit',
        subtitle: 'Menggabungkan biru senja dan merah jambu fajar',
        pullQuote:
          'Potongan kecil yang tampak tak berarti selalu menemukan tempatnya dalam pola besar.',
        paragraphs: [
          'Soren tidak pernah membuang sisa kain perca. Potongan biru pucat ia jahit berdampingan dengan sutra merah jambu muda, membentuk selimut perca lembut untuk beruang-beruang kecil yang bersiap hibernasi.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Jarum Terakhir Sebelum Subuh',
        subtitle: 'Menyambut matahari terbit',
        pullQuote:
          'Istirahat yang cukup adalah hadiah terbaik untuk esok yang cerah.',
        paragraphs: [
          'Tepat saat ayam jantan berkokok pertama kali, jahitan terakhir selesai. Soren menggulung sisa benangnya, menandatangani buku log malam, dan ikut terlelap dengan senyum puas.',
        ],
      },
    ],
  },
  {
    id: 'surat-untuk-kota-origami',
    title: 'Arsitektur Kota Origami',
    author: 'Kenji Mahendra',
    year: 2026,
    category: 'Puisi & Esai',
    pages: 154,
    readingMinutes: 19,
    totalCopies: 5,
    coverMotif: 'origami',
    accentTone: 'pink',
    synopsis:
      'Refleksi ringan tentang merancang ruang hidup yang lembut, ramah, dan terorganisir layaknya lipatan kertas yang presisi.',
    chapters: [
      {
        id: 'chap-1',
        number: 1,
        title: 'Garis Lipat sebagai Peta Jalan',
        subtitle: 'Mengapa struktur membuat kita lebih bebas',
        pullQuote:
          'Sekotak kertas datar baru bisa berdiri menjadi istana setelah ia berani dilipat dengan rapi.',
        paragraphs: [
          'Banyak orang mengira kreativitas berarti membiarkan segala hal berserakan tanpa aturan. Padahal, para maestro origami tahu bahwa bentuk naga atau bangau paling rumit pun dimulai dari lipatan dasar yang sangat bersih dan disiplin.',
          'Begitu pula ruang baca digital yang baik: daftar pinjaman yang rapi dan pengingat waktu yang lembut membebaskan pikiran kita untuk benar-benar tenggelam dalam cerita.',
        ],
      },
      {
        id: 'chap-2',
        number: 2,
        title: 'Warna Pastel dalam Ruang Kota',
        subtitle: 'Psikologi biru lembut dan merah jambu',
        pullQuote:
          'Warna yang tenang mengundang mata untuk beristirahat sejenak dari bisingnya layar.',
        paragraphs: [
          'Biru awan memberi sinyal ketenangan dan fokus yang jernih, sementara merah jambu lembut menghadirkan kehangatan emosional yang bersahabat. Perpaduan keduanya menciptakan ruang belajar dan membaca yang tidak melelahkan mata.',
        ],
      },
      {
        id: 'chap-3',
        number: 3,
        title: 'Membuka Lipatan Baru',
        subtitle: 'Kebiasaan membaca lima belas menit sehari',
        pullQuote:
          'Lima belas menit membaca sebelum tidur sanggup mengubah cara kita memandang seluruh minggu.',
        paragraphs: [
          'Mulailah dari satu bab pendek malam ini. Simpan pembatas bukumu, periksa jadwal pengembalianmu, dan biarkan esok hari terasa lebih tertata.',
        ],
      },
    ],
  },
];
