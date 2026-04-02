function AlertToast({ title, message, error = false }) {
    return (
        <div className="
        fixed
        top-6
        right-6
        w-[300px]
        z-50
        shadow-xl
        rounded-xl
        p-4
        animate-slideIn
        text-sm
        flex
        flex-col
        gap-1
        border
        bg-white
      ">
            <div className={`font-bold ${error ? "text-red-600" : "text-green-600"}`}>
                {title}
            </div>
            <div className={`${error ? "text-red-500" : "text-green-700"}`}>
                {message}
            </div>
        </div>
    );
}

export default AlertToast;
