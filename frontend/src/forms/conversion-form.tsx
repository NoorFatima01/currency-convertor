import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import { getAuth } from "firebase/auth";


type ConversionForm = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
};

type responseSymbol = {
  symbol: string;
  name: string;
}

const ConversionForm = () => {
  const { handleSubmit, control } = useForm<ConversionForm>(
    {
      defaultValues: {
        fromCurrency: "",
        toCurrency: "",
        amount: 0,
      },
    }
  );

  const auth = getAuth();
const user = auth.currentUser;
const uid = user?.uid;

  const [symbols, setSymbols] = useState<Record<string, string>>({});
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const fetchCurrencies = async () => {
    try {
      console.log("in fetch");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exchange/symbols`
      );
      const data = response.data.data;

      const symbolsObject: Record<string, string> = {};
      Object.entries(data).forEach(([key, value]: [string, unknown]) => {
        const { name } = value as responseSymbol;
        symbolsObject[key] = name;
      });

      return symbolsObject;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return {};
    }
  };

  useEffect(() => {
    const getSymbols = async () => {
      const symbolsObject = await fetchCurrencies();
      setSymbols(symbolsObject);
    };

    getSymbols();
  }, []);

  useEffect(() => {
    console.log(symbols);
  }, [symbols]);

  const onSubmit = async (data: ConversionForm) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exchange/convert`,
        {
          params: {
            from: data.fromCurrency,
            to: data.toCurrency,
            amount: data.amount,
            userId: uid
          },

        }
      );

      setConvertedAmount(response.data.convertedAmount);

      console.log(response);
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  return (
    <section className="mt-16">
      <div className="mx-auto w-[400px]">
        <h2 className="text-darkishBlue font-bold text-2xl ml-4 mt-4">
          Convert Your Desired Amount
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel>Convert From</InputLabel>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Select onChange={onChange} value={value}>
                    {Object.entries(symbols).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="fromCurrency"
              />
            </FormControl>

            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>Convert To</InputLabel>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <Select onChange={onChange} value={value}>
                      {Object.entries(symbols).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  control={control}
                  name="toCurrency"
                />
              </FormControl>
            </div>

            <div>
              <Controller
                name="amount"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    helperText={error ? error.message : null}
                    sx={{ m: 1, width: 300 }}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Amount"
                    variant="outlined"
                  />
                )}
              />
            </div>

            <button
              type="submit"
              className="ml-2 mt-2 text-white bg-darkishBlue p-2 rounded-md hover:bg-lightBlue"
            >
              Convert
            </button>
          </div>
        </form>

        <div className="mt-4">
          {convertedAmount ? (
            <div>
              <h3 className="text-darkishBlue">
                Converted Amount: {convertedAmount}
              </h3>
            </div>
          ) : null}
          </div>
      </div>
    </section>
  );
};

export default ConversionForm;
