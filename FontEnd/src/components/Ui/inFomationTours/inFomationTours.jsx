function InfomationTours({ data, title }) {
    return (
        <div className="text-center my-10">
            <p className="text-[30px]">{title}</p>
            <div className="grid grid-cols-3">
                {data.map((item, key) => {
                    return (
                        <div className="flex flex-col px-10 py-10 bg-white" key={key}>
                            <span className="mb-4"><img src={item.image} alt={item.name} className="img" /></span>
                            <div className="text-center">
                                <div className="text-xl text-black  mb-3">
                                    <p>{item.name}</p>
                                    <p className="text-red">{item.price}/Pax</p>
                                </div>
                                <span className="bg-blue-500 py-1 px-3 mt-5">
                                    Thanh Toán
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    );
}

export default InfomationTours;