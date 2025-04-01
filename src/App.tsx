import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { Input } from '@alfalab/core-components/input';
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

const brokersWithApi = ['Т-инвестиции', 'Алор', 'Фридом финанс', 'Финам'];

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
  const [steps, setStep] = useState<'init' | 'step1' | 'step2' | 'step3'>('init');
  const [selectedOption, setSelectedOption] = useState('Т-инвестиции');
  const [selectedOptionUpload, setSelectedOptionUpload] = useState<'auto' | 'upload' | 'manual' | ''>('');
  const [selectedActivesAmount, setSelectedActivesAmount] = useState<'one' | 'multiple'>('one');
  const [errorUpload, setErrorUpload] = useState('');
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = (skipTokenCheck: boolean) => {
    if (!apiToken && !skipTokenCheck) {
      setErrorUpload('Введите токен');
      return;
    }
    setErrorUpload('');
    setLoading(true);

    sendDataToGA({
      broker: selectedOption,
      broker_next: 'None',
      type:
        selectedOptionUpload === 'auto'
          ? 'API'
          : selectedOptionUpload === 'upload'
          ? 'report'
          : selectedActivesAmount === 'one'
          ? 'add_one'
          : 'add_more',
    }).then(() => {
      // LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
      setLoading(false);
    });
  };

  if (thxShow) {
    return <ThxLayout selectedOptionUpload={selectedOptionUpload} />;
  }

  switch (steps) {
    case 'step3': {
      return (
        <Step3
          apiToken={apiToken}
          setApiToken={setApiToken}
          submit={submit}
          loading={loading}
          selectedOptionUpload={selectedOptionUpload}
          errorUpload={errorUpload}
          onDrop={(acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) {
              setErrorUpload('Файл не выбран');
              return;
            }

            submit(true);
          }}
          selectedActivesAmount={selectedActivesAmount}
          setSelectedActivesAmount={setSelectedActivesAmount}
        />
      );
    }

    case 'step2': {
      return (
        <Step2
          goNext={() => {
            if (selectedOptionUpload === '') {
              setErrorUpload('Выберите способ подключения');
              return;
            }
            setErrorUpload('');
            setStep('step3');
          }}
          selectedOption={selectedOption}
          selectedOptionUpload={selectedOptionUpload}
          setSelectedOptionUpload={setSelectedOptionUpload}
          errorUpload={errorUpload}
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

const Step3 = ({
  selectedOptionUpload,
  apiToken,
  errorUpload,
  loading,
  setApiToken,
  submit,
  onDrop,
  selectedActivesAmount,
  setSelectedActivesAmount,
}: {
  selectedOptionUpload: 'auto' | 'upload' | 'manual' | '';
  submit: (skipTokenCheck: boolean) => void;
  loading: boolean;
  apiToken: string;
  setApiToken: (o: string) => void;
  errorUpload: string;
  onDrop: (acceptedFiles: File[]) => void;
  selectedActivesAmount: 'one' | 'multiple';
  setSelectedActivesAmount: (o: 'one' | 'multiple') => void;
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

  switch (selectedOptionUpload) {
    case 'manual': {
      return (
        <>
          <div className={appSt.container}>
            <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
              Шаг 3 из 3
            </Typography.Text>

            <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
              Добавление актива
            </Typography.TitleResponsive>

            <Typography.Text view="primary-medium">
              Выберите сколько хотите добавить активов и заполните данные — это поможет анализировать изменения в портфеле
            </Typography.Text>

            <div className={appSt.box} onClick={() => setSelectedActivesAmount('one')}>
              <PureCell horizontalPadding="none" verticalPadding="none">
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                      Добавить один актив
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Radio size={24} name="activesAmount" checked={selectedActivesAmount === 'one'} />
                </PureCell.Addon>
              </PureCell>
            </div>
            <div className={appSt.box} onClick={() => setSelectedActivesAmount('multiple')}>
              <PureCell horizontalPadding="none" verticalPadding="none">
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                      Добавить несколько активов
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Radio size={24} name="activesAmount" checked={selectedActivesAmount === 'multiple'} />
                </PureCell.Addon>
              </PureCell>
            </div>
          </div>
          <Gap size={96} />
          <div className={appSt.bottomBtn}>
            <ButtonMobile block view="primary" onClick={() => submit(true)} loading={loading}>
              Продолжить
            </ButtonMobile>
          </div>
        </>
      );
    }
    case 'auto': {
      return (
        <>
          <div className={appSt.container}>
            <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
              Шаг 3 из 3
            </Typography.Text>

            <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
              Настройка интеграции с Open API
            </Typography.TitleResponsive>

            <Typography.Text view="primary-medium">
              Скопируйте токен «Только для чтения» в личном кабинете брокера и вставьте его сюда. Он нужен только для
              загрузки списка сделок
            </Typography.Text>

            <Input
              placeholder="Токен"
              label="API токен"
              labelView="outer"
              hint="Токен из кабинета"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
              block
            />
          </div>
          <Gap size={96} />
          <div className={appSt.bottomBtn}>
            <ButtonMobile block view="primary" onClick={() => submit(false)} loading={loading} hint={errorUpload}>
              Подать заявку
            </ButtonMobile>
          </div>
        </>
      );
    }

    case 'upload': {
      return (
        <>
          <div className={appSt.container}>
            <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
              Шаг 3 из 3
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
    }

    default:
      return null;
  }
};

const Step2 = ({
  errorUpload,
  goNext,
  selectedOption,
  selectedOptionUpload,
  setSelectedOptionUpload,
}: {
  goNext: () => void;
  selectedOptionUpload: 'auto' | 'upload' | 'manual' | '';
  setSelectedOptionUpload: (o: 'auto' | 'upload' | 'manual' | '') => void;
  errorUpload: string;
  selectedOption: string;
}) => {
  return (
    <>
      <div className={appSt.container}>
        <Typography.Text style={{ marginTop: '1rem' }} view="tagline">
          Шаг 2 из 3
        </Typography.Text>

        <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
          Выберите способ подключения
        </Typography.TitleResponsive>

        {brokersWithApi.includes(selectedOption) && (
          <div className={appSt.box} onClick={() => setSelectedOptionUpload('auto')}>
            <PureCell horizontalPadding="none" verticalPadding="none">
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    Автоматически
                  </Typography.Text>
                  <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                    Подключите API и обновляйте данные без лишних действий
                  </Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
              <PureCell.Addon verticalAlign="center">
                <Radio size={24} name="uploadOptions" checked={selectedOptionUpload === 'auto'} />
              </PureCell.Addon>
            </PureCell>
          </div>
        )}

        <div className={appSt.box} onClick={() => setSelectedOptionUpload('upload')}>
          <PureCell horizontalPadding="none" verticalPadding="none">
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                  Загрузите отчет
                </Typography.Text>
                <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                  Мы сами обработаем данные отчета
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
            <PureCell.Addon verticalAlign="center">
              <Radio size={24} name="uploadOptions" checked={selectedOptionUpload === 'upload'} />
            </PureCell.Addon>
          </PureCell>
        </div>
        <div className={appSt.box} onClick={() => setSelectedOptionUpload('manual')}>
          <PureCell horizontalPadding="none" verticalPadding="none">
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                  Добавьте вручную
                </Typography.Text>
                <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                  Внесите самостоятельно данные об активах
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
            <PureCell.Addon verticalAlign="center">
              <Radio size={24} name="uploadOptions" checked={selectedOptionUpload === 'manual'} />
            </PureCell.Addon>
          </PureCell>
        </div>
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" onClick={goNext} hint={errorUpload}>
          Продолжить
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
          Шаг 1 из 3
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
            <Typography.Text view="primary-medium">Выберите удобный способ подключения</Typography.Text>
            <Typography.Text view="primary-medium">Следите за активами в Альфа-Инвестиции</Typography.Text>
          </Steps>
        </div>

        <img src={hb} alt="hb" width="100%" height={233} className={appSt.img} />
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" onClick={goNext}>
          Добавить портфель
        </ButtonMobile>
      </div>
    </>
  );
};
