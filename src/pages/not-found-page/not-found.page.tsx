import { PageContainer, Title } from "./not-found.styles";
import errorImg from '../../assets/imgs/404-img.svg'
import Button from "../../components/button/button.component";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (<PageContainer>
    <div className="flex flex-col items-center gap-2">
      <Title>
        OOPS!! Page not found
      </Title>
      <Title>
        Let’s get you home
      </Title>
      <Button
        type='button'
        className="w-42 !rounded-sm m-4"
        select='primary500'
        onClick={() => navigate('/')}

      >
        Get me home
      </Button>
    </div>

    <img src={errorImg} />
  </PageContainer>);

}
export default NotFoundPage;