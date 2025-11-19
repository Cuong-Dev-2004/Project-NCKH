// InfomationTours.jsx
import React from "react";

function InfomationTours({ data = [], title = "" }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center my-10">
        <p className="text-2xl font-semibold mb-4">{title}</p>
        <p className="text-gray-500">Hiện chưa có tour nào.</p>
      </div>
    );
  }

  return (
    <section className="text-center my-10 px-4">
      <h2 className="text-2xl md:text-[30px] font-bold mb-6">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((item, idx) => {
          const key = item.id ?? item.name ?? idx;
          return (
            <article key={key} className="flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name || "tour image"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-red-500 mt-2">{item.price} / Pax</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => {
                      // bạn có thể gọi callback ở đây (vd: props.onBook(item))
                      console.log("Thanh toán cho", item.name);
                    }}
                    aria-label={`Thanh toán ${item.name}`}
                  >
                    Thanh Toán
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default InfomationTours;
