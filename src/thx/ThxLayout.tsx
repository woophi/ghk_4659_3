import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Typography } from '@alfalab/core-components/typography';
import sparkles from '../assets/sparkles.png';
import { appSt } from '../style.css';
import { thxSt } from './style.css';

const link = 'alfabank://investments';

export const ThxLayout = ({ isUploadOrAuto }: { isUploadOrAuto: boolean }) => {
  return (
    <>
      <div className={thxSt.container}>
        <img src={sparkles} width={80} height={80} className={thxSt.rocket} />
        <Typography.TitleResponsive style={{ margin: '24px 0 12px' }} font="system" tag="h1" view="small" weight="medium">
          {isUploadOrAuto ? 'Ваша заявка принята' : 'Сервис пока недоступен'}
        </Typography.TitleResponsive>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
          {isUploadOrAuto
            ? 'Загружаем информацию, это займёт немного времени'
            : 'Вся команда очень старается, скоро всё заработает!'}
        </Typography.Text>
      </div>
      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="secondary" href={link} onClick={() => window.gtag('event', '4659_end_var3')}>
          {isUploadOrAuto ? 'Спасибо' : 'Понятно'}
        </ButtonMobile>
      </div>
    </>
  );
};
