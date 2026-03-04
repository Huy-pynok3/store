import Link from 'next/link'
import { Button, Card, Input } from '@/components/ui'

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-260px)] bg-[#f5f5f5] py-8 px-3">
      <div className="max-w-[980px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <Card className="p-5 md:p-6">
          <h1 className="text-[32px] md:text-[40px] leading-none font-bold text-[#3f3f3f] mb-4">
            Đăng nhập
          </h1>
          <div className="h-px bg-[#e9e9e9] mb-6" />

          <form className="space-y-5">
            <Input
              id="login-email"
              type="email"
              label="Email"
              fullWidth
              className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
            />

            <Input
              id="login-password"
              type="password"
              label="Mật khẩu"
              fullWidth
              className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
            />

            <Link href="/quen-mat-khau" className="inline-block text-xs text-[#767676] hover:text-[#2dbf6a]">
              Quên mật khẩu
            </Link>

            <label className="flex items-center gap-2 text-[15px] text-[#555] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#2dbf6a]" />
              Ghi nhớ đăng nhập
            </label>

            <Button
              type="submit"
              variant="success"
              size="sm"
              className="h-10 w-full sm:w-auto px-5 bg-[#2fbf4a] hover:bg-[#29a942] text-white text-[15px]"
            >
              Đăng nhập
            </Button>

            <p className="text-[#555]">Or</p>

            <Button
              type="button"
              size="sm"
              className="h-9 w-full sm:w-auto px-4 bg-[#4285f4] hover:bg-[#357ae8] text-white text-sm"
            >
              Login with Google
            </Button>
          </form>
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="text-[32px] md:text-[40px] leading-none font-bold text-[#3f3f3f] mb-4">Đăng ký</h2>
          <p className="text-[15px] text-[#65a768] mb-4">
            Chú ý: Nếu bạn sử dụng các chương trình Bypass Captcha có thể không đăng ký tài khoản được.
          </p>
          <div className="h-px bg-[#e9e9e9] mb-6" />

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="register-username"
                type="text"
                label="Tài khoản"
                fullWidth
                className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
              />

              <Input
                id="register-email"
                type="email"
                label="Email"
                fullWidth
                className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="register-password"
                type="password"
                label="Mật khẩu"
                fullWidth
                className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
              />

              <Input
                id="register-password-confirm"
                type="password"
                label="Nhập lại mật khẩu"
                fullWidth
                className="h-10 border-[#dcdcdc] focus:border-[#58bdd7]"
              />
            </div>

            <label className="flex items-start gap-2 text-[15px] text-[#555] cursor-pointer leading-tight">
              <input type="checkbox" defaultChecked className="accent-[#2dbf6a] mt-0.5" />
              <span>Tôi đã đọc và đồng ý với Điều khoản sử dụng Tạp Hóa MMO</span>
            </label>

            <Button
              type="submit"
              variant="success"
              size="sm"
              className="h-10 w-full sm:w-auto px-5 bg-[#2fbf4a] hover:bg-[#29a942] text-white text-[15px]"
            >
              Đăng ký
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
