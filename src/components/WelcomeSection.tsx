
interface WelcomeSectionProps {
  title: string;
}

const WelcomeSection = ({ title }: WelcomeSectionProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto py-5 pb-10">
      <h1 className="text-4xl font-bold bg-gray-700 bg-clip-text text-transparent">
        {title}
      </h1>
    </div>
  );
};

export default WelcomeSection;
