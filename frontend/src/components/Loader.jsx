import { motion } from 'framer-motion';

const Loader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-lightGray/95 backdrop-blur-sm">
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-royalBlue/20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-royalBlue"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent border-b-gold"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
        />
        <div className="w-4 h-4 bg-gradient-to-r from-royalBlue to-navyBlue rounded-full" />
      </div>
      <p className="text-sm text-darkText/50 font-medium">Loading...</p>
    </div>
  </div>
);

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-lightGray">
    <div className="relative flex flex-col items-center gap-5">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-royalBlue/20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-royalBlue"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-darkText">Loading page</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-royalBlue"
              animate={{ y: [-2, 4, -2] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export { Loader, PageLoader };
