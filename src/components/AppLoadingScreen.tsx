import logo from '@/assets/logo.webp';

const AppLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <img 
            src={logo} 
            alt="Football Team Generator" 
            className="h-20 w-20 mx-auto animate-pulse"
          />
          <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-primary/20 animate-ping"></div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Football Team Generator
        </h1>
        <p className="text-muted-foreground animate-pulse">
          Loading your team building tools...
        </p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;