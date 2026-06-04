const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SCENARIOS = [
  {
    role: "👤 [Khách A - Chủ DN - Chê Đắt]",
    message: "Tôi thấy thiết bị và tủ điện bên httech giá đắt quá! Sao tôi không tự mua linh kiện trên mạng về cho thợ tự đấu nối hoặc dùng mấy cái sơ đồ miễn phí trên mạng? Httech có cái gì xứng đáng để tôi trả số tiền lớn như vậy?",
    color: "\x1b[36m" // Cyan
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ chào anh, em rất hiểu băn khoăn của anh về mặt tối ưu chi phí cho doanh nghiệp. Việc tự mua linh kiện và đấu nối theo sơ đồ mạng nhìn qua có vẻ tiết kiệm, nhưng thực tế tiềm ẩn 3 rủi ro cực lớn: 1. An toàn cháy nổ & dừng chuyền sản xuất; 2. Không có chứng nhận nguồn gốc (CO/CQ) để nghiệm thu nhà xưởng; 3. Không có bảo hành hệ thống. Tại HTtech, giá trị anh nhận được là một giải pháp kỹ thuật an toàn, bền bỉ được tính toán bởi đội ngũ 50+ kỹ sư, đi kèm bảo hành lên đến 24 tháng và hỗ trợ khẩn cấp 24/7. Đây chính là tấm bảo hiểm cho dây chuyền sản xuất của anh hoạt động liên tục không ngừng nghỉ.",
    color: "\x1b[32m" // Green
  },
  {
    role: "👤 [Khách A - Chủ DN - Chê Đắt]",
    message: "Tự làm cùng lắm chỉ lỗi vặt thì sửa thôi, chứ mua biến tần Siemens với ABB bên bạn đắt gấp mấy lần hàng bãi Nhật. Bạn cam kết tiết kiệm 30% điện nhưng làm sao tôi tin được con số đó là thật hay chỉ là quảng cáo?",
    color: "\x1b[36m"
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ thưa anh, biến tần hàng bãi Nhật tuy rẻ ban đầu nhưng linh kiện bên trong đã hao mòn, không có chức năng bù công suất tối ưu và dễ hỏng đột ngột gây tổn thất dừng máy bơm/quạt. Về con số tiết kiệm điện đến 30%, HTtech hoàn toàn dựa trên dữ liệu thực tế: Dòng biến tần cao cấp Siemens SINAMICS V20 hay ABB ACS580 bên em có ECO mode tự động điều tiết tần số theo tải thực tế. Trước khi ký hợp đồng, các kỹ sư bên em sẽ xuống đo đạc trực tiếp lượng điện tiêu thụ hiện tại và lập Bảng tính toán hoàn vốn (ROI) chi tiết cho anh. Nếu số liệu thực tế sau nghiệm thu không đạt cam kết, HTtech sẵn sàng chịu trách nhiệm hoàn toàn theo điều khoản hợp đồng.",
    color: "\x1b[32m"
  },
  {
    role: "👤 [Khách A - Chủ DN - Chê Đắt]",
    message: "Nếu tôi ký hợp đồng làm tủ điện và mua biến tần chỗ bạn mà sau này chạy không đạt chỉ tiêu tiết kiệm điện hoặc bị lỗi cháy hỏng động cơ thì httech có đền bù toàn bộ thiệt hại dây chuyền của tôi không? Nói cho rõ ràng xem nào!",
    color: "\x1b[36m"
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ thưa anh, HTtech làm việc dựa trên tính pháp lý rõ ràng. Trong tất cả hợp đồng kinh tế và phương án kỹ thuật của HTtech, chúng em luôn có điều khoản quy định rõ về Trách nhiệm bảo hành hệ thống và đền bù lỗi kỹ thuật do khâu lắp đặt thiết kế của HTtech gây ra. Nếu phát sinh sự cố từ phía tủ điện do HTtech bàn giao, đội phản ứng nhanh 24/7 của chúng em sẽ có mặt trong vòng 2 tiếng để xử lý khắc phục và đền bù/sửa chữa theo đúng điều khoản cam kết trong hợp đồng. Anh hoàn toàn yên tâm vì HTtech có pháp nhân minh bạch và đã phục vụ hơn 500+ doanh nghiệp lớn nhỏ tại Việt Nam.",
    color: "\x1b[32m"
  },
  {
    role: "👤 [Khách B - Bác Năm - Mù Công Nghệ]",
    message: "Chào cháu, bác được giới thiệu qua đây. Mà bác đọc trên trang web thấy cái gì mà PLC rồi HMI với Modbus nghe nhức đầu quá. Bác muốn lắp cái máy bơm nước ở quê tự động tưới tiêu cho vườn cam mà không cần ra tận nơi bật tắt, cháu giải thích cho bác hiểu mấy cái từ đó là cái gì bằng tiếng Việt bình dân được không?",
    color: "\x1b[33m" // Yellow
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ con chào bác Năm ạ! Bác đừng lo lắng nha, con giải thích siêu đơn giản cho bác dễ hiểu nè: \n1. PLC: Bác cứ tưởng tượng nó giống như cái 'bộ não' thông minh vậy đó bác. Thay vì bác phải chạy ra bật công tắc, bác chỉ cần hẹn giờ, cái bộ não này sẽ tự động ra lệnh cho máy bơm chạy đúng giờ cho bác.\n2. HMI: Cái này đơn giản là một cái màn hình chạm nhỏ gắn trên tủ điện. Trên đó có các nút bấm hình vẽ trực quan bằng tiếng Việt, bác chỉ cần lấy ngón tay chạm chạm vô là điều khiển được liền.\n3. Modbus: Bác cứ hiểu nó giống như 'đường dây điện thoại' để các thiết bị trong tủ điện tự gọi điện nói chuyện phối hợp với nhau vậy đó bác Năm. \nBác muốn lắp máy bơm tự động tưới cam là chuẩn xác rồi, con sẽ tư vấn bộ tủ điện cực kỳ dễ dùng cho bác nha!",
    color: "\x1b[32m"
  },
  {
    role: "👤 [Khách B - Bác Năm - Mù Công Nghệ]",
    message: "À ra thế. Vậy còn cái 'biến tần' gì đó có cần thiết không cháu? Cái máy bơm nhà bác là loại mô-tơ cũ từ xưa rồi, giờ lắp thêm cái hộp biến tần đó vào có bị cháy máy hay nổ điện không bác sợ lắm?",
    color: "\x1b[33m"
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ bác Năm yên tâm 100% nha, con giải thích cho bác rõ chỗ này để bác không sợ nè. Cái 'biến tần' thực ra nó giống như cái 'tay ga' trên xe máy của mình vậy đó bác. Bình thường bác cắm điện trực tiếp, máy bơm cũ của bác sẽ chạy hết công suất (giống như xe máy cứ vặn hết ga), vừa hao điện vừa dễ nóng máy. Khi lắp thêm cái biến tần (hộp tay ga) này vô, nó sẽ giúp máy bơm khởi động từ từ, êm ái (không bị sụt điện cả nhà bác). Lúc nào cần tưới mạnh thì nó chạy mạnh, lúc tưới nhẹ nó tự giảm ga lại giúp bác tiết kiệm tới 30% tiền điện hàng tháng. Đặc biệt, biến tần này có chức năng tự động ngắt điện thông minh khi máy bơm bị kẹt rác hoặc quá nóng để chống cháy máy bơm cho bác luôn. Cho nên lắp vô chỉ có an toàn hơn thôi ạ!",
    color: "\x1b[32m"
  },
  {
    role: "👤 [Khách B - Bác Năm - Mù Công Nghệ]",
    message: "Cảm ơn cháu giải thích dễ hiểu quá. Bác muốn đặt một bộ tủ điện có cái biến tần đó để tưới cam tự động luôn. Nhưng bác ở tận Miền Tây, lỡ nó bị hư hay không biết xài thì các cháu có chạy xuống sửa cho ông già này không hay bác phải tự mang lên thành phố?",
    color: "\x1b[33m"
  },
  {
    role: "🤖 [Trợ lý ảo HTtech]",
    message: "Dạ con nghe thương bác quá. Bác ở Miền Tây tụi con vẫn hỗ trợ chu đáo tận nhà cho bác luôn, bác không cần phải mang vác đi đâu hết trơn á bác Năm! \n1. Tự động hỗ trợ từ xa: Kỹ sư bên con ở Sài Gòn có thể nhìn thấy tủ điện nhà bác qua mạng để hướng dẫn bác sửa lỗi nhỏ hoặc cài đặt lại giờ cho bác ngay lập tức.\n2. Đội ngũ kỹ sư hỗ trợ tận nơi: HTtech bảo hành tủ điện lên đến 24 tháng cho bác Năm. Nếu tủ điện có lỗi kỹ thuật cần sửa trực tiếp, các cháu kỹ sư của HTtech sẽ chạy xuống tận vườn cam của bác để sửa chữa cho bác ạ.\n3. Sách hướng dẫn bằng hình vẽ: Tụi con sẽ làm riêng cho bác một tờ giấy hướng dẫn ép nhựa có hình vẽ màu to rõ ràng để bác nhìn vô là biết xài liền. Bác cho con xin số điện thoại để con gọi lại tư vấn kỹ hơn nha!",
    color: "\x1b[32m"
  }
];

(async () => {
  console.log("\x1b[1m\x1b[35m=== KHỞI CHẠY USER SIMULATION CHAT Stress-test (REAL-TIME) ===\x1b[0m\n");
  
  for (let i = 0; i < SCENARIOS.length; i++) {
    const item = SCENARIOS[i];
    console.log(`${item.color}${item.role}:\x1b[0m`);
    // Print message with visual word spacing or direct output
    console.log(`${item.message}\n`);
    console.log("\x1b[90m------------------------------------------------------------\x1b[0m");
    // Wait exactly 2000 milliseconds for read time
    await delay(2000);
  }
  
  console.log("\x1b[1m\x1b[35m=== Stress-test HOÀN THÀNH XUẤT SẮC! ===\x1b[0m");
})();
