import HighlightEvents from "../../components/Ui/HighlightEvents/HighlightEvents";
import InfomationTours from "../../components/Ui/inFomationTours/inFomationTours";

export const mockTours = [
    {
        id: 1,
        name: "Tour Singapore - Malaysia 4N3Đ",
        price: "8,990,000 VND",
        image:
            "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-o-ha-noi-1.jpg",
    },
    {
        id: 2,
        name: "Tour Thái Lan 5N4Đ: Bangkok - Pattaya",
        price: "7,390,000 VND",
        image:
            "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-o-ha-noi-1.jpg",
    },
    {
        id: 3,
        name: "Tour Nhật Bản 6N5Đ: Tokyo - Kyoto - Osaka",
        price: "22,500,000 VND",
        image:
            "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-o-ha-noi-1.jpg",
    }
];
export const events = [
    {
        id: 1,
        title: "Quốc khánh 2/9 - Du lịch Đà Nẵng ngắm pháo hoa",
        date: "01/09 - 03/09",
        image: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2025/08/12/lich-nghi-le-quoc-khanh-2-9-nguoi-lao-dong.jpg",
        description: "Khám phá Đà Nẵng, tận hưởng lễ hội pháo hoa rực rỡ cùng những hoạt động sôi động.",
    },
    {
        id: 2,
        title: "Pháo Hoa Đà Nẵng",
        date: "20/04 - 27/04",
        image: "https://danangfantasticity.com/wp-content/uploads/2023/04/le-hoi-phao-hoa-quoc-te-da-nang-2023-diff-2023-the-gioai-khong-khoang-canh-tu-02-06-den-08-07-2023.jpg",
        description: "Trải nghiệm Những Trận Bắn Pháo Hoa Tại Đà Nẵng",
    },
    {
        id: 3,
        title: "Tết Nguyên Đán 2025",
        date: "26/01 - 02/02",
        image: "https://vov2.vov.vn/sites/default/files/styles/large/public/2023-05/a335.jpg",
        description: "Tận hưởng các bãi biển nổi tiếng Tại Đà Nẵng",
    }
];


function HomePage() {
    return (
        <div className="w-full  min-h-[500px] my-[20px]">
            <div className="text-center text-white my-5">
                <h2 className="text-4xl font-bold mt-6 ">Chào mừng đến với TravelTour</h2>
                <p>Khám phá những hành trình tuyệt vời cùng chúng tôi.</p>
            </div>
            <div>
                <section className="w-full bg-gradient-to-br from-blue-50 to-white">
                    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
                            Khám phá thế giới theo cách <span className="text-blue-600">riêng bạn</span>
                        </h1>
                        <p className="text-lg text-gray-700 leading-7 mb-6">
                            Tại <span className="font-semibold">[Tên thương hiệu của bạn]</span>, chúng tôi tin rằng
                            du lịch không chỉ là đi từ điểm A đến điểm B, mà là hành trình khám phá bản thân
                            qua những trải nghiệm mới.
                        </p>
                        <p className="text-lg text-gray-700 leading-7 mb-6">
                            Không còn tour cố định. Bạn có toàn quyền chọn hành trình và{" "}
                            <span className="font-semibold">người bạn đồng hành địa phương</span> của mình.
                            Hãy để mỗi chuyến đi trở thành một <span className="italic">câu chuyện đáng nhớ</span>.
                        </p>

                        <ul className="text-left max-w-md mx-auto space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-blue-600 font-bold mr-2">✔</span>
                                Chọn hướng dẫn viên phù hợp với phong cách & ngôn ngữ
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 font-bold mr-2">✔</span>
                                Tự do lên lịch trình theo mong muốn
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 font-bold mr-2">✔</span>
                                Kết nối an toàn và hỗ trợ 24/7
                            </li>
                        </ul>

                        <div className="mt-8">
                            <a
                                href="#explore"
                                className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Bắt đầu hành trình ngay
                            </a>
                        </div>
                    </div>
                </section>
            </div>
            <div className="">
                <HighlightEvents data={events} />
            </div>
            <div className="">
                <InfomationTours data={mockTours} title={"CHƯƠNG TRÌNH GỢI Ý KHỞI HÀNH TỪ HÀ NỘI"} />
                <InfomationTours data={mockTours} title={"CHƯƠNG TRÌNH GỢI Ý KHỞI HÀNH TỪ Đà Nẵng"} />
                <InfomationTours data={mockTours} title={"CHƯƠNG TRÌNH GỢI Ý KHỞI HÀNH TỪ Hồ Chí Minh"} />
            </div>

        </div>
    );
}

export default HomePage;
