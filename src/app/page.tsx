import ImageEditor from './components/ImageEditor';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-red-50 p-4 sm:p-8">
      {/* Removed the top stripes for a cleaner look */}
      {/* <div className="absolute top-0 left-0 w-full h-24 bg-red-600 z-0"></div>
      <div className="absolute top-24 left-0 w-full h-4 bg-white z-0"></div>
      <div className="absolute top-28 left-0 w-full h-4 bg-red-600 z-0"></div> */}

      {/* Simplified Header */}
      <header className="w-full max-w-4xl mx-auto text-center my-8">
        {/* Removed the separate V50+ circle */}
        {/* <div className="bg-white rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center shadow-lg border-4 border-red-600">
            <h1 className="text-5xl font-bold text-red-600">V50+</h1>
          </div> */}
        {/* Made title larger and bolder */}
        <h1 className="text-7xl font-extrabold text-red-600 mb-3 font-sans">VIWO 50+</h1>
        <p className="text-gray-700 font-medium text-xl">输入加价百分比，生成 V 我支付图片</p>
      </header>

      {/* Enhanced Main Content Area */}
      <main className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-red-100">
        <ImageEditor />
      </main>

      {/* Refined Footer */}
      <footer className="mt-10 text-center text-gray-600 text-xs w-full max-w-2xl mx-auto">
        <p>© {new Date().getFullYear()} VIWO 50+ 计算器 | 仅供娱乐使用</p>
        <p className="mt-1">本图片仅为娱乐目的而制作，不用于任何商业用途。图片中可能包含的KFC标志及相关内容，其版权归KFC及其所属公司所有。本项目与KFC或其关联公司无任何官方联系。所有计算和修改仅为虚构娱乐，不代表真实数据或情况。</p>
      </footer>
    </div>
  );
}