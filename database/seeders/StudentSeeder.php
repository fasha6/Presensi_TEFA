<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['nis' => '20240001', 'name' => 'Ahmad Rizki Maulana', 'class_name' => 'X PPL 1', 'major' => 'PPL', 'attendance_percentage' => 85, 'violations_count' => 4, 'warning_letters_count' => 1, 'risk_level' => 'medium', 'parent_name' => 'Bapak Maulana', 'parent_phone' => '081234567890'],
            ['nis' => '20240002', 'name' => 'Siti Nurhaliza', 'class_name' => 'XI PPL 1', 'major' => 'PPL', 'attendance_percentage' => 92, 'violations_count' => 2, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Nur', 'parent_phone' => '081298765432'],
            ['nis' => '20240003', 'name' => 'Budi Santoso', 'class_name' => 'XII TJK 3', 'major' => 'TJK', 'attendance_percentage' => 78, 'violations_count' => 6, 'warning_letters_count' => 2, 'risk_level' => 'high', 'parent_name' => 'Bapak Santoso', 'parent_phone' => '081276543210'],
            ['nis' => '20240004', 'name' => 'Devi Anggraini', 'class_name' => 'XI AKL 3', 'major' => 'AKL', 'attendance_percentage' => 96, 'violations_count' => 0, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Anggraini', 'parent_phone' => '081265432109'],
            ['nis' => '20240005', 'name' => 'Eko Prasetyo', 'class_name' => 'XII PM 2', 'major' => 'PM', 'attendance_percentage' => 88, 'violations_count' => 2, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Bapak Prasetyo', 'parent_phone' => '081254321098'],
            ['nis' => '20240006', 'name' => 'Fatimah Zahra', 'class_name' => 'XI MPL 2', 'major' => 'MPL', 'attendance_percentage' => 90, 'violations_count' => 1, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Zahra', 'parent_phone' => '081243210987'],
            ['nis' => '20240007', 'name' => 'Gilang Ramadhan', 'class_name' => 'XII TLG 2', 'major' => 'TLG', 'attendance_percentage' => 82, 'violations_count' => 5, 'warning_letters_count' => 1, 'risk_level' => 'medium', 'parent_name' => 'Bapak Ramadhan', 'parent_phone' => '081232109876'],
            ['nis' => '20240008', 'name' => 'Hani Safitri', 'class_name' => 'XI TKF 3', 'major' => 'TKF', 'attendance_percentage' => 94, 'violations_count' => 1, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Safitri', 'parent_phone' => '081221098765'],
            ['nis' => '20240009', 'name' => 'Irfan Hakim', 'class_name' => 'XII TLM 2', 'major' => 'TLM', 'attendance_percentage' => 87, 'violations_count' => 3, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Bapak Hakim', 'parent_phone' => '081210987654'],
            ['nis' => '20240010', 'name' => 'Jihan Aulia', 'class_name' => 'XI DKV 1', 'major' => 'DKV', 'attendance_percentage' => 91, 'violations_count' => 1, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Aulia', 'parent_phone' => '081209876543'],
            ['nis' => '20240011', 'name' => 'Kurnia Aji', 'class_name' => 'X TET 1', 'major' => 'TET', 'attendance_percentage' => 75, 'violations_count' => 7, 'warning_letters_count' => 2, 'risk_level' => 'high', 'parent_name' => 'Bapak Aji', 'parent_phone' => '081298761234'],
            ['nis' => '20240012', 'name' => 'Lina Marlina', 'class_name' => 'XI TJK 2', 'major' => 'TJK', 'attendance_percentage' => 93, 'violations_count' => 1, 'warning_letters_count' => 0, 'risk_level' => 'low', 'parent_name' => 'Ibu Marlina', 'parent_phone' => '081287651234'],
        ];

        foreach ($students as $student) {
            Student::query()->updateOrCreate(
                ['nis' => $student['nis']],
                $student,
            );
        }
    }
}
