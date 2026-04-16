import { Link } from "react-router";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 mx-auto mb-6 text-gray-400" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
        </p>
        <Link to="/">
          <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
