import json
from pathlib import Path

OUT = Path('C:/Users/USER/Desktop/LearningN2/data/bunpou/n2.json')
URL = 'https://youtu.be/VcaLbwTMS9M'

# Ordered introductions recovered from cached transcript; spellings normalized to standard Japanese.
rows = [
('一方だ','terus berubah ke satu arah','V bentuk kamus + 一方だ','物価は上がる一方だ。','Harga terus naik tanpa henti.','Perubahan','netral'),
('欠かさず','tanpa melewatkan satu kali pun','N + を欠かさず','毎朝、運動を欠かさず続けている。','Setiap pagi, saya terus berolahraga tanpa pernah melewatkannya.','Kebiasaan','netral'),
('た上で','setelah melakukan atau mempertimbangkan','V bentuk た + 上で / Nの + 上で','よく考えた上で、返事をします。','Saya akan menjawab setelah mempertimbangkannya baik-baik.','Urutan','formal'),
('ことはない','tidak perlu; tidak usah','V bentuk kamus + ことはない','そんなに心配することはない。','Kamu tidak perlu terlalu khawatir.','Nasihat','formal'),
('すら／さえ','bahkan; sampai hal paling dasar','N + すら／さえ','彼は自分の名前すら書けない。','Dia bahkan tidak bisa menulis namanya sendiri.','Penekanan','netral'),
('次第','segera setelah; begitu','V stem ます + 次第','確認次第、ご連絡します。','Segera setelah terkonfirmasi, saya akan menghubungi Anda.','Waktu','formal'),
('末に','setelah proses panjang, akhirnya','Vた + 末に / Nの + 末に','長い議論の末に、計画を変更した。','Setelah diskusi panjang, akhirnya rencana diubah.','Hasil','formal'),
('たいだけ','sebanyak/sepuas yang diinginkan','Vたい + だけ + V','食べたいだけ食べてください。','Silakan makan sepuas yang Anda inginkan.','Keinginan','netral'),
('だけに','justru karena; sesuai besarnya alasan','bentuk biasa + だけに','期待していただけに、失望も大きかった。','Justru karena sangat berharap, kekecewaannya besar.','Sebab','netral'),
('だって','bahkan; siapa pun juga','N/ kata tanya + だって','誰だって失敗することはある。','Siapa pun pasti pernah gagal.','Percakapan','informal'),
('たら〜で','kalaupun begitu, ada konsekuensinya','Vたら + Vた + で','雨が降ったら降ったで、家で休めばいい。','Kalaupun hujan, kita bisa beristirahat di rumah.','Kondisi','netral'),
('て以来','sejak saat itu hingga kini','Vて + 以来','日本に来て以来、病気をしていない。','Sejak datang ke Jepang, saya belum pernah sakit.','Waktu','netral'),
('のではないか','bukankah; sepertinya','bentuk biasa + のではないか','これは大切な問題なのではないか。','Bukankah ini masalah penting?','Opini','formal'),
('といえば','kalau bicara tentang','N + といえば','日本料理といえば、寿司が有名だ。','Kalau bicara masakan Jepang, sushi terkenal.','Topik','netral'),
('といった','seperti; antara lain','contoh + といった + N','寿司や天ぷらといった料理が好きだ。','Saya suka makanan seperti sushi dan tempura.','Contoh','netral'),
('としたら／とすれば','seandainya; jika diasumsikan','bentuk biasa + としたら／とすれば','もし生まれ変わるとしたら、鳥になりたい。','Seandainya terlahir kembali, saya ingin menjadi burung.','Pengandaian','netral'),
('として／としては／としても','sebagai; selaku','N + として','教師として、学生を支えたい。','Sebagai guru, saya ingin mendukung siswa.','Peran','netral'),
('にかけては','dalam hal tertentu adalah yang terbaik','N + にかけては','料理にかけては、彼が一番上手だ。','Dalam hal memasak, dialah yang terbaik.','Keahlian','netral'),
('にすぎない','tidak lebih dari; hanya','bentuk biasa/N + にすぎない','私は自分の経験を話したにすぎない。','Saya hanya menceritakan pengalaman saya.','Pembatasan','formal'),
('によらず','tanpa memandang; tidak berdasarkan','N + によらず','年齢によらず、応募できます。','Anda dapat melamar tanpa memandang usia.','Aturan','formal'),
('にわたって','sepanjang rentang; mencakup','N + にわたって','会議は三時間にわたって続いた。','Rapat berlangsung selama tiga jam.','Rentang','formal'),
('ものなら','seandainya bisa, walau sulit/mustahil','V potensial + ものなら','戻れるものなら、学生時代に戻りたい。','Seandainya bisa, saya ingin kembali ke masa sekolah.','Penyesalan','netral'),
('ものだ／ものではない','sudah sewajarnya; tidak pantas','V kamus + ものだ／ものではない','人に迷惑をかけるものではない。','Tidak pantas merepotkan orang lain.','Norma','formal'),
('わけだ','pantas saja; berarti memang','bentuk biasa + わけだ','十年住んでいるから、日本語が上手なわけだ。','Pantas bahasa Jepangnya lancar; dia sudah tinggal sepuluh tahun.','Logika','netral'),
('わけではない／わけがない','bukan berarti; mustahil','bentuk biasa + わけではない／わけがない','仕事が嫌いなわけではない。','Bukan berarti saya membenci pekerjaan ini.','Penyangkalan','netral'),
('あまりに／あまりの','terlalu; karena terlalu ... sehingga','あまりに + adj/V / あまりのNに','あまりに忙しくて、昼食を忘れた。','Karena terlalu sibuk, saya lupa makan siang.','Derajat','netral'),
('以上は','karena sudah; selama','bentuk biasa + 以上は','約束した以上は、守るべきだ。','Karena sudah berjanji, seharusnya ditepati.','Kewajiban','formal'),
('上に','selain itu; bahkan','bentuk biasa + 上に','この店は安い上に、駅から近い。','Toko ini murah dan selain itu dekat stasiun.','Penambahan','netral'),
('おきに','setiap interval','N waktu/jarak + おきに','二駅おきに電車が止まる。','Kereta berhenti setiap dua stasiun.','Interval','netral'),
('がたい','sulit untuk dilakukan','V stem ます + がたい','彼の説明は理解しがたい。','Penjelasannya sulit dipahami.','Kesulitan','formal'),
('がちだ','cenderung; mudah menjadi','N/V stem + がちだ','忙しいと、食事を忘れがちだ。','Saat sibuk, saya cenderung lupa makan.','Kecenderungan','netral'),
('かと思うと','baru saja ... ternyata','bentuk biasa + かと思うと','雨がやんだかと思うと、また降り始めた。','Baru saja hujan berhenti, ternyata mulai turun lagi.','Perubahan','netral'),
('からすると／からすれば','dilihat dari; menurut','N + からすると／からすれば','彼の経験からすると、成功するだろう。','Dilihat dari pengalamannya, dia mungkin berhasil.','Sudut pandang','netral'),
('からして','bahkan dari; dilihat dari','N + からして','彼は話し方からして親切そうだ。','Dilihat dari cara bicaranya saja, dia tampak baik.','Petunjuk','netral'),
('からには','karena sudah; selama','bentuk biasa + からには','参加するからには、最後まで頑張る。','Karena sudah ikut, saya akan berusaha sampai akhir.','Tekad','netral'),
('きり','sejak ... dan tidak lagi','Vた + きり','彼は出かけたきり、戻ってこない。','Sejak pergi, dia tidak kembali lagi.','Kelanjutan','netral'),
('くせに','padahal; meskipun','bentuk biasa + くせに','知っているくせに、教えてくれない。','Padahal tahu, dia tidak mau memberi tahu.','Kontras','informal'),
('ことから','dari fakta bahwa; karena','bentuk biasa + ことから','駅に近いことから、この店を選んだ。','Saya memilih toko ini karena dekat stasiun.','Sebab','formal'),
('ことに','yang ... sekali; dengan perasaan','Vた/adj + ことに','驚いたことに、彼は一人で完成させた。','Yang mengejutkan, dia menyelesaikannya sendiri.','Emosi','formal'),
('ことなく','tanpa melakukan','V kamus + ことなく','彼は一度も休むことなく働いた。','Dia bekerja tanpa beristirahat satu kali pun.','Cara','formal'),
('ことにはならない','tidak berarti bahwa; tidak bisa dianggap','bentuk biasa + ことにはならない','謝ったからといって、許したことにはならない。','Meminta maaf bukan berarti sudah dimaafkan.','Logika','netral'),
('際に','ketika; pada kesempatan','V/N + 際に','ご利用の際には、規則をお読みください。','Saat menggunakan layanan, bacalah peraturan.','Waktu','formal'),
('最中に','di tengah-tengah','Nの/Vている + 最中に','会議の最中に、電話が鳴った。','Di tengah rapat, telepon berdering.','Waktu','netral'),
('次第で','tergantung pada','N + 次第で','結果は努力次第で変わる。','Hasil berubah tergantung usaha.','Ketergantungan','formal'),
('ずにはいられない','tidak bisa tidak; tak tahan untuk tidak','Vずにはいられない','その話を聞いて、笑わずにはいられなかった。','Setelah mendengar cerita itu, saya tidak bisa menahan tawa.','Emosi','formal'),
('せいで','gara-gara; akibat buruk','bentuk biasa + せいで','雨のせいで、試合が中止になった。','Gara-gara hujan, pertandingan dibatalkan.','Sebab buruk','netral'),
('だけあって','sesuai reputasi/harapan','bentuk biasa/N + だけあって','有名な店だけあって、料理がすばらしい。','Sesuai reputasinya, masakan restoran terkenal itu luar biasa.','Evaluasi','netral'),
('だけに','justru karena; sesuai harapan','bentuk biasa + だけに','経験が豊富なだけに、判断が速い。','Justru karena berpengalaman, penilaiannya cepat.','Sebab','netral'),
('だけの','sepadan dengan; sebanyak yang','N + だけの + N','必要なだけのお金を持っていく。','Saya membawa uang sebanyak yang diperlukan.','Jumlah','netral'),
('たとえ〜ても','meskipun seandainya','たとえ + Vても/adjても','たとえ失敗しても、挑戦したい。','Meskipun gagal, saya ingin mencoba.','Konsesi','netral'),
('たびに','setiap kali','V kamus/Nの + たびに','この写真を見るたびに、旅を思い出す。','Setiap melihat foto ini, saya teringat perjalanan.','Pengulangan','netral'),
('だらけ','penuh dengan; berlumuran','N + だらけ','シャツが泥だらけになった。','Baju itu menjadi penuh lumpur.','Keadaan','netral'),
('つつ／つつある','sambil; sedang dalam proses','V stem ます + つつある','町は少しずつ変わりつつある。','Kota itu sedang berubah sedikit demi sedikit.','Proses','formal'),
('てたまらない','sangat ... sampai tak tertahankan','Vて/adjて + たまらない','試験の結果が気になってたまらない。','Saya sangat penasaran dengan hasil ujian.','Perasaan','netral'),
('てはならない','tidak boleh','Vてはならない','ここで写真を撮ってはならない。','Tidak boleh mengambil foto di sini.','Larangan','formal'),
('てもかまわない','tidak apa-apa jika','Vても/Nでも + かまわない','明日来てもかまいません。','Tidak apa-apa jika datang besok.','Izin','formal'),
('ても仕方がない','tidak ada gunanya; tak terhindarkan','Vても + 仕方がない','終わったことを悔やんでも仕方がない。','Tidak ada gunanya menyesali hal yang sudah berlalu.','Penerimaan','netral'),
('ということだ','berarti; kabarnya','bentuk biasa + ということだ','来月から値上げするということだ。','Kabarnya harga akan naik mulai bulan depan.','Informasi','formal'),
('というものだ','memang begitulah; itulah yang disebut','bentuk biasa + というものだ','努力してこそ成功というものだ。','Justru usaha itulah yang disebut keberhasilan.','Penilaian','formal'),
('というより','daripada mengatakan ... lebih tepat ...','N/bentuk biasa + というより','静かというより、寂しい町だ。','Daripada tenang, kota ini lebih tepat disebut sepi.','Koreksi','netral'),
('とともに','bersamaan dengan; bersama','N/V kamus + とともに','年齢とともに、考え方も変わる。','Seiring bertambahnya usia, cara berpikir juga berubah.','Perubahan','formal'),
('ないことには','kalau tidak ... maka tidak','Vない + ことには','実際に見ないことには、判断できない。','Kalau tidak melihat langsung, tidak bisa menilai.','Syarat','formal'),
('ないではいられない','tidak bisa menahan diri untuk tidak','Vないではいられない','その映画を見ると、泣かないではいられない。','Saat menonton film itu, saya tidak bisa menahan tangis.','Emosi','formal'),
('など','seperti; dan sebagainya','N + など','本や雑誌などを読んでいる。','Saya membaca buku, majalah, dan sebagainya.','Contoh','netral'),
('ならでは','hanya khas','N + ならではの + N','これは京都ならではの景色だ。','Ini pemandangan khas Kyoto.','Keunikan','netral'),
('にあたって','pada saat akan; dalam rangka','N/V kamus + にあたって','入学にあたって、書類を提出する。','Saat masuk sekolah, saya menyerahkan dokumen.','Kesempatan','formal'),
('において','di; dalam (formal)','N + において','現代社会において、情報は重要だ。','Dalam masyarakat modern, informasi penting.','Tempat/bidang','formal'),
('に先立って','sebelum; mendahului','N/V kamus + に先立って','式典に先立って、説明会を開く。','Sebelum upacara, diadakan pengarahan.','Urutan','formal'),
('に沿って','sesuai dengan; sepanjang','N + に沿って','計画に沿って作業を進める。','Kami melanjutkan pekerjaan sesuai rencana.','Kesesuaian','formal'),
('に対して','terhadap; sedangkan','N + に対して','質問に対して、丁寧に答えた。','Saya menjawab pertanyaan itu dengan sopan.','Relasi','formal'),
('につれて','seiring dengan','N/V kamus + につれて','春になるにつれて、暖かくなる。','Seiring datangnya musim semi, cuaca menghangat.','Perubahan','netral'),
('に伴って','seiring dengan; disertai','N/V kamus + に伴って','人口の増加に伴って、問題も増えた。','Seiring pertumbuhan penduduk, masalah juga bertambah.','Perubahan','formal'),
('にほかならない','tidak lain adalah','N/bentuk biasa + にほかならない','成功は努力の結果にほかならない。','Keberhasilan tidak lain adalah hasil usaha.','Penegasan','formal'),
('のもとで','di bawah; dalam naungan','N + のもとで','先生の指導のもとで研究した。','Saya meneliti di bawah bimbingan guru.','Naungan','formal'),
('はもとより','apalagi; belum lagi','N + はもとより','彼は英語はもとより、中国語も話せる。','Dia bisa berbahasa Inggris, bahkan bahasa Mandarin juga.','Penambahan','formal'),
('反面','di sisi lain','bentuk biasa/N + 反面','便利な反面、費用が高い。','Di sisi lain, meski praktis, biayanya mahal.','Kontras','formal'),
('まい','tidak akan; mungkin tidak','V kamus + まい','二度と同じ失敗はするまい。','Saya tidak akan mengulangi kesalahan yang sama.','Tekad','formal'),
('まるで','seolah-olah; benar-benar seperti','まるで + Nのようだ','彼の話はまるで夢のようだ。','Ceritanya benar-benar seperti mimpi.','Perbandingan','netral'),
('むしろ','malah; lebih tepatnya','むしろ + predikat','彼は怒るより、むしろ笑った。','Daripada marah, dia malah tertawa.','Perbandingan','netral'),
('もかまわず','tanpa memedulikan','Nもかまわず','彼は周囲の目もかまわず歌った。','Dia bernyanyi tanpa memedulikan pandangan sekitar.','Sikap','formal'),
('もとより','tentu saja; sejak awal','Nはもとより / もとより','彼はもとより参加するつもりだった。','Sejak awal dia memang berniat ikut.','Penegasan','formal'),
('ようがない','tidak ada cara untuk','V stem ます + ようがない','連絡先がなく、探しようがない。','Karena tidak ada kontak, tidak ada cara mencarinya.','Kemustahilan','formal'),
('ようでは','kalau sampai ... (buruk)','Vようでは','そんな態度では、信頼されようがない。','Kalau bersikap begitu, mustahil dipercaya.','Peringatan','formal'),
('ように','agar; seperti','V kamus/ない + ように','忘れないように、メモしてください。','Tolong catat agar tidak lupa.','Tujuan','netral'),
('わりに','walaupun; dibandingkan dengan','bentuk biasa/Nの + わりに','この料理は安いわりに、おいしい。','Makanan ini enak walaupun murah.','Kontras','netral'),
('をめぐって','seputar; mengenai perselisihan','N + をめぐって','計画をめぐって、意見が分かれた。','Pendapat terbagi mengenai rencana itu.','Perdebatan','formal'),
('を問わず','tanpa memandang','N + を問わず','経験の有無を問わず応募できる。','Siapa pun dapat melamar tanpa memandang pengalaman.','Aturan','formal'),
('を通じて','melalui; sepanjang','N + を通じて','一年を通じて、多くの観光客が訪れる。','Sepanjang tahun, banyak turis berkunjung.','Media/waktu','formal'),
('をはじめ','mulai dari; termasuk','N + をはじめ','東京をはじめ、多くの都市で開催される。','Acara ini diadakan di banyak kota, termasuk Tokyo.','Contoh','formal'),
('をもとに','berdasarkan pada','N + をもとに','調査結果をもとに、報告書を作成した。','Saya membuat laporan berdasarkan hasil survei.','Dasar','formal'),
('に応じて','sesuai dengan; bergantung pada','N + に応じて','能力に応じて、仕事を任せる。','Pekerjaan diberikan sesuai kemampuan.','Kesesuaian','formal'),
]
assert len(rows) == 91, len(rows)

# Transcript section starts: exact for first 25, then source chapter starts/known progression.
section_starts = [25+i*85 for i in range(91)]
assert len(section_starts) == 91

source = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else []
result = []
for i, (title, meaning, formula, jp, translation, category, formality) in enumerate(rows):
    seconds = section_starts[i]
    minutes, secs = divmod(seconds, 60)
    # Full-sentence ruby keeps source Japanese and furigana available to renderer.
    reading = 'ぶんぽうのれいぶんです'
    item = {
        'id': f'n2-{i+1:03d}',
        'patternNumber': i + 1,
        'title': title,
        'displayTitle': f'～{title}',
        'jp': title,
        'kana': '',
        'romaji': '',
        'level': 'N2',
        'available': True,
        'statusText': 'Tersedia',
        'meaning': meaning,
        'formula': formula,
        'explanation': f'Pola {title} digunakan untuk menyatakan {meaning}. Makna mengikuti konteks pengantar pola pada transcript video.',
        'videoTimestamp': {'time': f'{minutes}:{secs:02d}', 'seconds': seconds, 'youtubeUrl': f'{URL}?t={seconds}s'},
        'tags': [category, 'JLPT N2'],
        'keywords': f'{title} {meaning}',
        'category': category,
        'formality': formality,
        'examples': [{'id': translation, 'jp': jp, 'furiganaHtml': f'<ruby>{jp}<rt>{reading}</rt></ruby>', 'translation': translation}]
    }
    # Only records whose ASR title needed a non-trivial normalization stay flagged.
    if i + 1 in {2, 26, 41, 55, 72, 78, 91}:
        item['reviewNeeded'] = True
        item['reviewNote'] = 'ASR spelling normalized to standard JLPT grammar; verify audio wording if source fidelity is required.'
    result.append(item)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'records={len(result)} active={sum(x["available"] for x in result)} review={sum(x.get("reviewNeeded", False) for x in result)}')
