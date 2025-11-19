function HighlightEvents({ data }) {
    return (
        <div className="my-10 px-6">
            <h2 className="text-2xl font-bold mb-4"> Sự kiện & Lễ hội nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="h-48 w-full object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-black">{event.title}</h3>
                            <p className="text-sm text-black">{event.date}</p>
                            <p className="text-sm mt-2 line-clamp-3 text-black">{event.description}</p>
                            <button className="mt-3 bg-blue-600 text-black px-3 py-2 rounded hover:bg-blue-700 text-sm">
                                Xem Tour Liên Quan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HighlightEvents;
