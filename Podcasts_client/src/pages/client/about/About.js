import React from 'react';


function About(){
    return(
        <>
              <header className="site-header d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-2">Về chúng tôi</h2>
            </div>
          </div>
        </div>
      </header>
        <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8 col-12 mx-auto">
                        <div className="pb-5 mb-5">
                            <div className="section-title-wrap mb-4">
                                <h4 className="section-title">Câu Chuyện Của Chúng Tôi</h4>
                            </div>

                            <p>Chào mừng bạn đến với podcast ẩm thực của chúng tôi! Chúng tôi là những người yêu thích ẩm thực và đam mê chia sẻ niềm vui nấu ăn với mọi người. Tại đây, chúng tôi cùng nhau khám phá những món ăn ngon, từ các công thức truyền thống đậm đà đến những sáng tạo ẩm thực mới mẻ. Mỗi tập podcast là một hành trình thú vị, nơi chúng tôi gặp gỡ các đầu bếp, nhà phê bình ẩm thực, và những người đam mê nấu nướng để cùng chia sẻ câu chuyện, bí quyết và kinh nghiệm trong thế giới ẩm thực.</p>

                            <p>Mục tiêu của chúng tôi là mang lại những khoảnh khắc thú vị và bổ ích cho thính giả, giúp bạn không chỉ học hỏi được những công thức nấu ăn ngon mà còn cảm nhận được niềm vui trong từng bữa ăn. Hãy cùng chúng tôi khám phá và tận hưởng thế giới ẩm thực phong phú qua từng tập podcast. Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>

                

                            <div className="section-title-wrap mt-5 mb-4">
                                <h4 className="section-title">Đội Ngũ Đầu Bếp</h4>
                            </div>
                            <p>Đội ngũ đầu bếp của chúng tôi gồm những người đam mê nấu ăn và có kinh nghiệm phong phú trong lĩnh vực ẩm thực. Họ luôn sẵn sàng chia sẻ những công thức nấu ăn độc đáo và mẹo vặt để giúp bạn tạo ra những bữa ăn tuyệt vời.</p>
                            <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fdoi%20ngu%20dau%20bep.jpg?alt=media&token=3df077a4-e332-44e8-b0fb-bd7f28687c74" className="about-image mt-3 img-fluid" alt="Đội ngũ đầu bếp"></img>

                            <div className="section-title-wrap mt-5 mb-4">
                                <h4 className="section-title">Món Ăn Ngon</h4>
                            </div>
                            <p>Chúng tôi luôn tìm kiếm và thử nghiệm những món ăn mới, từ các món ăn truyền thống đến những món ăn hiện đại. Dưới đây là một số hình ảnh về các món ăn ngon mà chúng tôi đã giới thiệu trong podcast.</p>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-12">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2F804611.jpg?alt=media&token=240ee391-a5f5-4a5b-bdbe-4e959ddcccd1" className="about-image mt-3 img-fluid" alt="Món ăn ngon 1"></img>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/images%2Fbanner%20con%202.jpg?alt=media&token=e684fbff-1cb6-4362-9750-3dd0dd86d658" className="about-image mt-3 img-fluid" alt="Món ăn ngon 2"></img>
                                </div>
                            </div>

                            <p className="mt-4">Hãy cùng chúng tôi khám phá thêm nhiều món ăn ngon và hấp dẫn qua từng tập podcast. Chúng tôi hy vọng rằng những chia sẻ của chúng tôi sẽ truyền cảm hứng và giúp bạn tìm thấy niềm vui trong việc nấu nướng.</p>
                        </div>
                    </div>
                </div>
            </div>
            </>
    )
}

export default About;