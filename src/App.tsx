import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { PureCell } from '@alfalab/core-components/pure-cell';
import { Radio } from '@alfalab/core-components/radio';
import { Steps } from '@alfalab/core-components/steps';
import { Typography } from '@alfalab/core-components/typography';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import alor from './assets/alor.png';
import another from './assets/another.png';
import bks from './assets/bks.png';
import exante from './assets/exante.png';
import finam from './assets/finam.png';
import freedom from './assets/freedom.png';
import gaz from './assets/gaz.png';
import hb from './assets/hb.png';
import int_bro from './assets/int_bro.png';
import invest_pal from './assets/invest_pal.png';
import sber from './assets/sber.png';
import tbank from './assets/tbank.png';
import vtb from './assets/vtb.png';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { ThxLayout } from './thx/ThxLayout';
import { sendDataToGA, sendDataToGAFirstInfo } from './utils/events';

const data = [
  {
    title: 'Т-инвестиции',
    logo: tbank,
  },
  {
    title: 'Алор',
    logo: alor,
  },
  {
    title: 'Фридом финанс',
    logo: freedom,
  },
  {
    title: 'Финам',
    logo: finam,
  },
  {
    title: 'БКС',
    logo: bks,
  },
  {
    title: 'ВТБ Инвестиции',
    logo: vtb,
  },
  {
    title: 'СберИнвестиции',
    logo: sber,
  },
  {
    title: 'Exante',
    logo: exante,
  },
  {
    title: 'Interactive Brokers',
    logo: int_bro,
  },
  {
    title: 'Газпром Инвестиции',
    logo: gaz,
  },
  {
    title: 'ИнвестПалата',
    logo: invest_pal,
  },
  {
    title: 'Другой брокер',
    logo: another,
  },
];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [steps, setStep] = useState<'init' | 'step1' | 'step2'>('init');
  const [selectedOption, setSelectedOption] = useState('Т-инвестиции');
  const [errorUpload, setErrorUpload] = useState('');

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = () => {
    setErrorUpload('');
    setLoading(true);

    sendDataToGA({
      broker: selectedOption,
      broker_next: 'None',
      type: 'report',
    }).then(() => {
      // LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
      setLoading(false);
    });
  };

  if (thxShow) {
    return <ThxLayout isUploadOrAuto={steps === 'step2'} />;
  }

  switch (steps) {
    case 'step2': {
      return (
        <Step2
          onDrop={(acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) {
              setErrorUpload('Файл не выбран');
              return;
            }

            submit();
          }}
          errorUpload={errorUpload}
          loading={loading}
        />
      );
    }

    case 'step1':
      return (
        <Step1
          goNext={() => {
            window.gtag('event', '4659_next_var3');
            setLoading(true);
            sendDataToGAFirstInfo({ broker: selectedOption }).then(() => {
              setLoading(false);
              setStep('step2');
            });
          }}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          loading={loading}
        />
      );

    default:
      return (
        <InitStep
          goNext={() => {
            window.gtag('event', '4659_add_var3');
            setStep('step1');
          }}
        />
      );
  }
};

const Step2 = ({
  errorUpload,
  loading,
  onDrop,
}: {
  loading: boolean;
  errorUpload: string;
  onDrop: (acceptedFiles: File[]) => void;
}) => {
  const { getInputProps, open: openDropzone } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'text/html': ['.html'],
    },
    onDrop,
    multiple: false,
    maxFiles: 1,
  });

  return (
    <>
      <div className={appSt.container}>
        <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
          Шаг 2 из 2
        </Typography.Text>

        <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
          Загрузите отчёт
        </Typography.TitleResponsive>

        <Typography.Text view="primary-medium">Загрузите последний отчет от вашего брокера</Typography.Text>

        <Steps isVerticalAlign={true} interactive={false} className={appSt.stepStyle}>
          <Typography.Text view="primary-medium">
            Скачайте отчет у вашего брокера. Обычно подходят файлы xls и html
          </Typography.Text>
          <Typography.Text view="primary-medium">Загрузите отчёт</Typography.Text>
          <Typography.Text view="primary-medium">Дождитесь обработки файла</Typography.Text>
        </Steps>
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <input {...getInputProps()} />
        <ButtonMobile block view="primary" onClick={openDropzone} loading={loading} hint={errorUpload}>
          Выбрать файл
        </ButtonMobile>
      </div>
    </>
  );
};

const Step1 = ({
  goNext,
  selectedOption,
  setSelectedOption,
  loading,
}: {
  goNext: () => void;
  setSelectedOption: (o: string) => void;
  selectedOption: string;
  loading: boolean;
}) => {
  return (
    <>
      <div className={appSt.container}>
        <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
          Шаг 1 из 2
        </Typography.Text>

        <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
          Выберите брокера
        </Typography.TitleResponsive>

        {data.map((item, index) => (
          <PureCell key={index} onClick={() => setSelectedOption(item.title)} verticalPadding="tiny">
            <PureCell.Graphics verticalAlign="center">
              <img src={item.logo} width={48} height={48} alt={item.title} />
            </PureCell.Graphics>
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="primary-medium">{item.title}</Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
            <PureCell.Addon verticalAlign="center">
              <Radio size={20} checked={selectedOption === item.title} name="brokerOptions" />
            </PureCell.Addon>
          </PureCell>
        ))}
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" onClick={goNext} loading={loading}>
          Далее
        </ButtonMobile>
      </div>
    </>
  );
};

const InitStep = ({ goNext }: { goNext: () => void }) => {
  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h1" view="large" font="system" weight="semibold">
          Все ваши инвестиции в одном месте
        </Typography.TitleResponsive>
        <Typography.Text view="primary-medium">
          Загрузите данные о своих активах от других брокеров в Альфа-Инвестиции и следите за ними удобнее
        </Typography.Text>

        <div>
          <Typography.TitleResponsive tag="h2" view="small" color="primary" weight="semibold">
            Как это работает
          </Typography.TitleResponsive>
          <Gap size={12} />
          <Steps isVerticalAlign={true} interactive={false} className={appSt.stepStyle}>
            <Typography.Text view="primary-medium">Выберите брокера</Typography.Text>
            <Typography.Text view="primary-medium">Загрузите брокерский отчет</Typography.Text>
            <Typography.Text view="primary-medium">Следите за активами в Альфа-Инвестиции</Typography.Text>
          </Steps>
        </div>

        <img src={hb} alt="hb" width="100%" height={233} className={appSt.img} />
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" onClick={goNext}>
          Загрузить отчет
        </ButtonMobile>
      </div>
    </>
  );
};
