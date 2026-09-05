type UserInfoProps = {
    name?: string;
};

const UserInfoComponent = ({ name = "Dmytro" }: UserInfoProps) => {
    const initial = name.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col items-center group cursor-pointer select-none">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold border border-white/30 shadow-md group-hover:scale-105 transition-transform">
                {initial}
            </div>
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors mt-1">
        {name}
      </span>
        </div>
    );
};

export default UserInfoComponent;