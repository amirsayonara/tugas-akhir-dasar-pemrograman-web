// global variabel default 0 = belum bayar
sudah_bayar = [0,0,0,0];
dibayarkan = [0,0,0,0];
abaikan = [38,40,37,39,20,13,16,65,17,8,46,9];//keypress event yang diabaikan
// data sekarang adalah 0 tidak ada data yang ditampilkan pada ke-3 tab
// index 0 ditulis -1 karena tidak dipakek (cuma simbol dan tidak harus ditulis demikian)
data_sekarang = [-1,0,0,0];
// membuat data orang yang sudah pesan (data kecil-kecilan)
var data = [[160411100153, "Tuan Moch. Amir", "Garuda (Dewasa) x 1", "Surabaya - Tokyo",12450000, 0, 143],
            [160411100157, "Tuan Fahril Mabahist", "Citylink (Dewasa) x 1", "Surabaya - Jeddah", 9839000, 120000, 763],
            [160411100146, "Tuan Akmad Faizal Anshori", "Citylink (Dewasa) x 1", "Surabaya - Taiwan", 10340000, 0, 232],
            [160411100150, "Tuan Abdul Ghofur", "Garuda (Dewasa) x 1", "Jakarta - Eropa", 13287000, 800000, 231]
            ], jumlah2, kode;

function auto_complete_off() { //fungsi auto complete/dari input text mati
    var form = document.getElementsByTagName("form");
    for (var x=0; x<form.length; x++) form[x].setAttribute("autocomplete","off");
}

function buka_tab(event, namaTab) {
    // definisi variabel
    var i, tabcontent, tablinks;

    // mencari semua class="tabcontent" dan titutup
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // mencari semua class="tablinks" menghapus class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // menampilkan tab yang dipilih dan mengubah menjadi class "active"
    document.getElementById(namaTab).style.display = "block";
    event.currentTarget.className += " active";
}
function no_pemesanan_ubah(tab) {
    if (document.getElementById('hasil'+tab).innerHTML.indexOf('Tidak Ditemukan')!=-1)
        document.getElementById('hasil'+tab).innerHTML = "";
}
function cek_no_pemesanan() {
    var tab_aktif, ada = false
    // dicek tab mana yang saat ini terbuka
    if (document.getElementsByClassName("tablinks active")[0].innerHTML=="Kartu Kredit") {
        tab_aktif = 1;
    } else if (document.getElementsByClassName("tablinks active")[0].innerHTML=="ATM") {
        tab_aktif = 2;
    } else {
        tab_aktif = 3;
    }
    var no_pemesanan = document.getElementById("no_pemesanan"+tab_aktif).value;
    if (no_pemesanan=="") {
        focus("no_pemesanan"+tab_aktif);
        document.getElementById("no_pemesanan"+tab_aktif).style.border = "1px solid red";
        return false;
    } else {document.getElementById("no_pemesanan"+tab_aktif).style.border = "1px solid #c5c5d0";}
    // mengecek no pesanan yang diinput ada/nggak
    for (var x=0; x<=data.length-1; x++) {
        if (data[x][0]==no_pemesanan) {ada = true; break;}
    }
    // jika no. pesanan yang diinputkan ada maka menulis semua informasinya
    // jika tidak ada menulis tidak ditemukan
    if (ada) {
        kanan = "<div style='float:left;'>";
        for (var y=0; y<data[x].length; y++) {
            if (y==4|y==5|y==6) kanan += ": "+rupiah(data[x][y])+"<br>";
            else kanan += ": "+data[x][y]+"<br>";
        } var jumlah = data[x][4]+data[x][5]+data[x][6];
        if (tab_aktif==2) {
            document.getElementById('nominal').setAttribute('maxlength', jumlah.toString().length);
            jumlah2 = jumlah;
        } if (tab_aktif==3&data_sekarang[tab_aktif]!=no_pemesanan) {
            kode = random_char();
            document.getElementById('kode').innerHTML = kode;
        }
        kanan += "<b>: "+rupiah(jumlah)+"</b></div>";
        var kiri = "<div style='float:left;width:170px'>No. Pemesanan<br>Nama Pemesan"+
        "<br>Keterangan<br>Rute<br>Biaya<br>Bagasi<br>No. Unik<br><b>Total Pembayaran</b></div>";
        tulis = kiri+kanan;data_sekarang[tab_aktif] = no_pemesanan;
    } else tulis = "<span style='color:red'>No. Pemesanan Tidak Ditemukan</span>";

    // menuliskan hasil tadi ke dalam elemen yang aktif
    document.getElementById("hasil"+tab_aktif).innerHTML = tulis;
    // mengecek sudah pernah bayar/tidak
    if (ada&sudah_bayar[x]==0) { //jika belum bayar dan data ada
        document.getElementById('form'+tab_aktif).style.display = "block";
        document.getElementById('pembayaran'+tab_aktif).style.display = "none";
    }
    else if (sudah_bayar[x]==1) { //jika sudah bayar dan data ada
        document.getElementById('form'+tab_aktif).style.display = "none";
        tampilkan_pembayar(x, tab_aktif);
    }
    else { //jika data tidak ada
        document.getElementById('form'+tab_aktif).style.display = "none";
        document.getElementById('pembayaran'+tab_aktif).style.display = "none";
    }
    return false; //agar tidak lompat/action ke link lain
}

function rupiah(angka) { //fungsi membuat angka menjadi satuan mata uang Rp xxx.xxx
    angka = angka.toString();
    var tmp = "", re = "Rp ", c = 0;
    for (var x=angka.length-1; x>=0; x--) {
        tmp += angka[x];c += 1;
        if (c%3==0 & x!=0) tmp += ".";
    } for (var x=tmp.length-1; x>=0; x--) re += tmp[x];
    return re;
}
function catat_pembayar(id, tab) {
    var prov = ['Jawa Timur', 'Jawa Barat', 'Jawa Tengah', 'Kalimantan Timur', 'Kalimantan Barat', 'Kalimantan Tengah'];
    var kab = ['Bangkalan', 'Sampang', 'Pamekasan', 'Sumenep', 'Jakarta', 'Malang', 'Palembang'], data;
    if (tab==1) {
        data = [];
        data.push(value('nama_lengkap'));
        if (document.getElementById('laki').checked) data.push('Laki-laki')
        else data.push('Perempuan');
        data.push(value('alamat'));
        data.push(prov[document.getElementById('provinsi').selectedIndex-1]);
        data.push(kab[document.getElementById('kabupaten').selectedIndex-1]);
        data.push(value('pos'));
        data.push(value('email'));
        if (dibayarkan[id]==0) dibayarkan[id] = data;
    } else if (tab==2) {
        data = [];
        data.push(value('no_rekening'));
        data.push(value('atas_nama'));
        if (dibayarkan[id]==0) dibayarkan[id] = data;
    } else {
        if (dibayarkan[id]==0) dibayarkan[id] = kode;
    }
}
function tampilkan_pembayar(id, tab) {
    var tmp = "", kiri, kanan = "<div style='float:left;'>", tulis = "<h2>Pembayaran telah dilakukan</h2>";
    if (dibayarkan[id].length==7) {
        kiri = "<div style='float:left;width:170px'>Nama Lengkap<br>Jenis Kelamin"+
        "<br>Alamat<br>Provinsi<br>Kabupaten<br>Kode Pos<br>E-mail<br></div>";
        for (var x=0; x<dibayarkan[id].length; x++) {
            kanan+=': '+dibayarkan[id][x]+'<br>';
        } kanan += '</div>';
        tulis += 'Identitas Pembayar:<hr>';
    } else if (dibayarkan[id].length==2) {
        tulis += 'Identitas Pembayar:<hr>';
        kiri = "<div style='float:left;width:170px'>No. Rekening<br>Atas Nama</div>";
        for (var x=0; x<dibayarkan[id].length; x++) {
            kanan+=': '+dibayarkan[id][x]+'<br>';
        } kanan += '</div>';
    } else {
        tulis += 'Dibayarkan oleh Bank:<hr>';
        kiri = "<div style='float:left;width:170px'>Kode Pembayaran</div>";
        kanan += ': '+dibayarkan[id]+'</div>';
    }
    document.getElementById('pembayaran'+tab).innerHTML = tulis + kiri + kanan;
    document.getElementById('pembayaran'+tab).style.display = "block";
}
function value(id) {
    return document.getElementById(id).value;
}
//fungsi melakukan pembayaran tiap tab
function lakukan_pembayaran1() {
    if (!cek_kartu_kredit()) return false;
    if (!cek_nama_lengkap()) return false;
    if (!cek_kelamin()) return false;
    if (!cek_alamat()) return false;
    if (!cek_provinsi_kabupaten()) return false;
    if (!cek_pos()) return false;
    if (!cek_email()) return false;
    for (var x=0; x<data.length; x++) if (data[x][0]==data_sekarang[1]) {sudah_bayar[x] = 1;break}
    document.getElementById('form1').style.display = "none";
    catat_pembayar(x, 1);
    tampilkan_pembayar(x, 1);
    document.getElementById('form11').reset();
    return false;
}
function cek_no_rekening() {
    var isi = value('no_rekening'), patt=/^(([0-9]{4} ){3}[0-9]{4})$/;
    if (isi=="") {focus('no_rekening'); return false}
    if (!patt.test(isi)) {
        salah('no_rekening'); return false;
    }
    return true;
}
function cek_atas_nama() {
    var patt = /^([A-z ]+)$/, isi = value('atas_nama');
    if (isi=="") {focus('atas_nama'); return false}
    if (!patt.test(isi)) {
        salah('atas_nama'); return false
    }
    return true;
}
function cek_rekening_tujuan() {
    var isi = value('rekening_tujuan'), rek1 = '0006 1234 5678 9012', rek2 = '0001 1234 5678 9012';
    if (isi=="") {focus('rekening_tujuan'); return false}
    if (isi!=rek1&isi!=rek2) {
        salah('rekening_tujuan'); return false;
    }
    return true;
}
function cek_nominal() {
    var isi = value('nominal');
    if (isi=="") {focus('nominal');return false}
    if (isi!=jumlah2) {
        salah('nominal');return false
    }
    return true;
}
function lakukan_pembayaran2() {
    if (!cek_no_rekening()) return false;
    if (!cek_atas_nama()) return false;
    if (!cek_rekening_tujuan()) return false;
    diubah('rekening_tujuan');
    if (!cek_nominal()) return false;
    for (var x=0; x<data.length; x++) if (data[x][0]==data_sekarang[2]) {sudah_bayar[x] = 1;break}
    document.getElementById('form2').style.display = "none";
    catat_pembayar(x, 2);
    tampilkan_pembayar(x, 2);
    document.getElementById('form22').reset();
    return false;
}
function lakukan_pembayaran3() {
    for (var x=0; x<data.length; x++) if (data[x][0]==data_sekarang[3]) {sudah_bayar[x] = 1;break}
    document.getElementById('form3').style.display = "none";
    catat_pembayar(x, 3);
    tampilkan_pembayar(x, 3);
    document.getElementById('form33').reset();
    return false;
}
//validasi
function cek_kartu_kredit() {
    var patt=/^(([0-9]{4}-){3}[0-9]{4})$/;
    var no = document.getElementById('no_kartu').value;
    var berlaku = document.getElementById('berlaku_kartu').value;
    var cvv = document.getElementById('cvv').value;
    if (no=="") {focus('no_kartu');return false;}
    if (!patt.test(no)) {
        salah('no_kartu');
        return false;
    } if (berlaku=="") {focus('berlaku_kartu');return false}
    patt = /^(((0[7-9]|1[0-2])\/2017)|(0[1-9]|1[0-2])\/20(1[8-9]|[2-9][0-9]))$/;
    if (!patt.test(berlaku)) {
        salah('berlaku_kartu');
        return false;
    } if (cvv=="") {focus('cvv');return false}
    patt = /^([0-9]{3})$/
    if (!patt.test(cvv)) {
        salah('cvv');
        return false;
    }
    return true; 
}
function cek_nama_lengkap() {
    var nama = document.getElementById('nama_lengkap').value;
    if (nama=="") {
        focus('nama_lengkap');
        return false;
    }
    var patt = /^([A-z ]+)$/
    if (!patt.test(nama)) {
        salah('nama_lengkap'); return false
    }
    return true;
}
function cek_kelamin() {
    if (!document.getElementById('laki').checked&!document.getElementById('perempuan').checked) {
        salah('kelamin');focus('laki');
        return false;
    } return true;
}
function cek_alamat() {
    var tmp = document.getElementById('alamat').value;
    if (tmp=="") {focus('alamat');return false}
    if (tmp.split(' ').length<2) {
        salah('alamat'); return false;
    } return true;
}
function cek_provinsi_kabupaten() {
    if (document.getElementById('provinsi').selectedIndex==0) {
        salah('provinsi'); return false;
    }
    if (document.getElementById('kabupaten').selectedIndex==0) {
        salah('kabupaten'); return false;
    }
    return true;
}
function cek_pos() {
    var tmp = document.getElementById('pos').value;
    if (tmp=="") {focus('pos');return false}
    if (tmp.length!=5|isNaN(tmp)) {
        salah('pos'); return false;
    } return true;
}
function cek_email() {
    var patt = /^[A-z0-9_.]+@([A-z0-9]+[._][A-z0-9]{1,})+$/;
    var email = document.getElementById('email').value;
    if (email=="") {focus('email');return false}
    if (!patt.test(email)) {salah('email');return false}
    return true;
}
function diubah(id) {
    document.getElementById('salah_'+id).style.display = "none";
    if (id!='kelamin') document.getElementById(id).style.border='1px solid #c5c5d0'
}
function salah(id) {
    document.getElementById('salah_'+id).style.display = "block";
    if (id!='kelamin') document.getElementById(id).style.border='1px solid red';
    if (id!='kelamin') focus(id);
}
function nama_lengkap_ubah() {
    var tmp = document.getElementById('nama_lengkap').value;
    document.getElementById('nama_lengkap').value = titleCase(tmp);
}
function atas_nama_ubah() {
    var tmp = value('atas_nama');
    document.getElementById('atas_nama').value = titleCase(tmp);
}
function no_kartu_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('no_kartu').value, tmp="";
    var count = 1;
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false) {
            if (count==4&x!=18) {
                tmp += value[x]+'-';count = 0;
            }
            else tmp += value[x];
            count += 1;
        }
    }
    if (tmp.length>19) {
        var back = tmp; tmp = "";
        for (var x=0;x<19; x++) tmp += back[x];
    }
    document.getElementById('no_kartu').value = tmp;
}
function no_rekening_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('no_rekening').value, tmp="";
    var count = 1;
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false&value[x]!=' ') {
            if (count==4&x!=18) {
                tmp += value[x]+' ';count = 0;
            }
            else tmp += value[x];
            count += 1;
        }
    }
    if (tmp.length>19) {
        var back = tmp; tmp = "";
        for (var x=0;x<19; x++) tmp += back[x];
    }
    document.getElementById('no_rekening').value = tmp;
}
function rekening_tujuan_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('rekening_tujuan').value, tmp="";
    var count = 1;
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false&value[x]!=' ') {
            if (count==4&x!=18) {
                tmp += value[x]+' ';count = 0;
            }
            else tmp += value[x];
            count += 1;
        }
    }
    if (tmp.length>19) {
        var back = tmp; tmp = "";
        for (var x=0;x<19; x++) tmp += back[x];
    }
    document.getElementById('rekening_tujuan').value = tmp;
}
function nominal_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('nominal').value, tmp="";
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false&value[x]!=' ') {
            tmp += value[x];
        }
    }
    document.getElementById('nominal').value = tmp;
}
function cvv_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('cvv').value, tmp="";
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false&value[x]!=' ') {
            tmp += value[x];
        }
    }
    document.getElementById('cvv').value = tmp;
}
function pos_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('pos').value, tmp="";
    for (var x=0; x<value.length+1; x++) {
        if (isNaN(value[x])==false&value[x]!=' ') {
            tmp += value[x];
        }
    }
    document.getElementById('pos').value = tmp;
}
function berlaku_kartu_ubah(event) {
    if (abaikan.indexOf(event.keyCode) != -1) return;
    var value = document.getElementById('berlaku_kartu').value, tmp=[], re="";
    for (var x=0; x<value.length; x++) {
        if (isNaN(value[x])==false) tmp.push(value[x])
    }
    if (tmp[0] > 1) tmp[0] = '0'+tmp[0];
    tmp = tmp.toString();
    for (var x=0; x<tmp.length; x++) {
        if (isNaN(tmp[x])==false)
            if (x==2) re += tmp[x]+'/';
            else re += tmp[x];
    }
    if (re.length>7) {
        var back = re; re = "";
        for (var x=0;x<7; x++) re += back[x];
        if (re.indexOf('/')==-1) {
            back = re; re = "";
            for (var x=0; x<6; x++) {
                re += back[x];
                if (x==1) re += '/';
            }
        }
    }
    document.getElementById('berlaku_kartu').value = re;
}
function titleCase(string) {
    if (string==""|string==null) return "";string = string.split(" ");
    for (var i in string) {
        if(string[i]!="" & string[i]!=null)
            string[i] = string[i][0].toUpperCase() + string[i].substring(1).toLowerCase();
    } var text = ""; for (var i in string) {
        text += string[i];if (i != string.length - 1) text += " ";
    }return text;
}
function focus(id) {
    document.getElementById(id).focus();
}
function random_char() {
    var tmp="", data = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (var x=0; x<10; x++) {
        tmp += data.charAt(Math.floor(Math.random()*data.length));
    } return tmp;
}