<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
    'nis' => '242510397',
    'name' => 'AGHRY ADRYANTO',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510398',
    'name' => 'ANAS NASRULLOH',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510399',
    'name' => 'AULIA NOVIA SHUANDHARI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510400',
    'name' => 'BAGJA SASTRA ATMANAGARA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510401',
    'name' => "DHIIYA'ALI MALIK DZULFIQAR",
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510402',
    'name' => 'FARDI FIRMANSYAH',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510403',
    'name' => 'FERDIANSYAH',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510404',
    'name' => 'FINSA ANGGA RAMADHAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510405',
    'name' => 'GALIH ADIL DARMAWAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510406',
    'name' => 'GAZLAN HAZIQE EL AKBAR',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510407',
    'name' => 'HAURA SALSABIL',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510408',
    'name' => 'IBNU FARREL HERMAWAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510409',
    'name' => 'JENISA NURFADILLAH',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510410',
    'name' => 'KAHVI RIZKY HARDIANSYAH',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510411',
    'name' => 'M GIBRAN RASYAD BAIS SUKMANA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510412',
    'name' => 'MOCHAMAD HAMBY ALFARIZI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510413',
    'name' => 'MOCHAMAD ARSY ZULFA NUR SAFIQ',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510414',
    'name' => 'MUHAMMAD FATHIR AKBARRUSSALAM',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510415',
    'name' => 'MUHAMMAD FAREL NUGRAHA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510416',
    'name' => 'MUHAMMAD FASHA PRATAMA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510417',
    'name' => 'MUHAMMAD RAFFA ANUGRAH SOPA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510418',
    'name' => 'NAFIS IKHSAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510419',
    'name' => 'RAFI RASYAD MUHAMMAD',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510420',
    'name' => 'RAKA NURDIANA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510421',
    'name' => 'REGINA AFRINIALI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510422',
    'name' => 'REHAN ALFARIDZI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510423',
    'name' => 'RIKI RUHIKMAT',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510424',
    'name' => 'RUSTAMAN DELVIANOVA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510425',
    'name' => 'SALMAN ROHIMAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510426',
    'name' => 'SEPTIAN RAMADHAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510427',
    'name' => 'SHABRINA NAFFISAH AYYASY',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510428',
    'name' => 'SHELA PITRIANI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510429',
    'name' => 'SHELLY MUTHIA AZZAHRA',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '20240002',
    'name' => 'Siti Nurhaliza',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510430',
    'name' => 'TRISTAN MALIKA ZULKIFLI',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510431',
    'name' => 'ZAKI ALGHANI RACHMAN',
    'class_name' => 'XI PPL 1',
],

[
    'nis' => '242510432',
    'name' => 'ZEFI NURFADILAH',
    'class_name' => 'XI PPL 1',
],
        ];

        foreach ($students as $student) {
            Student::query()->updateOrCreate(
                ['nis' => $student['nis']],
                $student,
            );
        }
    }
}
