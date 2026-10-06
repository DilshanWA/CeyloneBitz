import { Link } from 'react-router-dom';
export default function App() {
  return (
    <div>
      <section id='/' className='h-[90vh] w-full bg-black justify-center items-center flex'>
        <div className='w-full max-w-6xl m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4'>
          <div className='h-full'>
            <span className="skew-pill inline-block bg-flame px-3 py-1 text-xs font-bold uppercase tracking-widest italic rounded-full text-black">New fusion drops weekly</span>
            <h1 className="mt-6 font-display text-6xl leading-[0.85] tracking-tight md:text-8xl text-white">
              FUSION<br /><span className="text-flame">AT FULL</span><br />SPEED
            </h1>
            <p className="mt-6 max-w-md text-lg text-paper/70">Bold Asian-Latin plates with Sri Lankan fire. Order in, pick up hot, or get it dropped at your door.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              
            </div>
          </div>
          <div className='h-full rounded-lg flex justify-center items-center'>
            <img src='images/hero.jpg' alt='hero' className='w-full h-full object-cover rounded-[50px]' />
          </div>
        </div>
      </section>
    </div>
       
  )
}
