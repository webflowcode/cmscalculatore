import Currency from "https://cdn.skypack.dev/currency.js@2.0.4";
let {
  Row,
  InputGroup,
  Form,
  Col,
  Button,
  DropdownButton,
  Dropdown
} = ReactBootstrap;

class LogicalCalculation {
  constructor() {}
  getMonthlyPayment(loanAmount, interestRate, months) {
    let factor = 1;
    const rate = interestRate / 1200;
    const interestRatePlusOne = rate + 1;
    for (let i = 0; i < months; i++) {
      factor *= interestRatePlusOne;
    }
    return (loanAmount * factor * rate) / (factor - 1);
  }
  amortRowClass(
    year,
    date,
    payment,
    principalPaid,
    totalPrincipalPaid,
    interest,
    total,
    balance,
    buydownamount,
    acceleratedPayment,
    interestAccelerated,
    totalInterestAccelerated,
    acceleratedBalance
  ) {
    const resultRow = {
      date: date,
      payment: payment
        ? payment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      year: year,
      principalPaid: principalPaid
        ? principalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      totalPrincipalPaid: totalPrincipalPaid
        ? totalPrincipalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      interest: interest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      totalInterest: total
        ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      balance: balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      buydownamount: buydownamount
        ? buydownamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      acceleratedPayment: acceleratedPayment
        ? acceleratedPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      interestAccelerated: interestAccelerated
        ? interestAccelerated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      totalInterestAccelerated: totalInterestAccelerated
        ? totalInterestAccelerated
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0,
      acceleratedBalance: acceleratedBalance
        ? acceleratedBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0
    };
    return resultRow;
  }
  pmt(rate_per_period, number_of_payments, present_value, future_value, type) {
    if (rate_per_period != 0.0) {
      var q = Math.pow(1 + rate_per_period, number_of_payments);
      return (
        -(rate_per_period * (future_value + q * present_value)) /
        ((-1 + q) * (1 + rate_per_period * type))
      );
    } else if (number_of_payments != 0.0) {
      return -(future_value + present_value) / number_of_payments;
    }
    return 0;
  }

  AmortizationComputeBuydown(loanAmount, interestRate, months, buydown) {
    const today = new Date();
    let monthNumber = today.getMonth() + 1;
    let yearNumber = today.getFullYear();
    /**/

    var loanAmount = Math.abs(Number(loanAmount));
    var months = Number(months);
    var interestRate = Number(interestRate);
    var buydownInterestRate = Number(interestRate);

    var monthlyPayment = 0;
    var buydownMonthlyPayment = 0;

    var balance = loanAmount;
    var errormsg = "";
    var totalMonthlyPayment;
    var totalBuydownMonthlyPayment;

    var loanStartMonth = monthNumber;
    var loanStartYear = yearNumber;
    var interestPaid = 0;
    var buydownInterestPaid = 0;
    var buydownamount = 0;
    var totalbuydownamount = 0;
    var totalInterest = 0;
    var principalPaid = 0;
    var totalPrincipalPaid = 0;
    var amortData = new Array();
    var tableRows = new Array();
    var rate = interestRate / 12;
    var buydownRate = buydownInterestRate / 12;

    buydownInterestRate = buydownInterestRate - buydown;
    monthlyPayment = this.getMonthlyPayment(loanAmount, interestRate, months);
    buydownMonthlyPayment = this.getMonthlyPayment(
      loanAmount,
      buydownInterestRate,
      months
    );

    var monthcount = 1;
    for (var i = 0; i < months; i++) {
      if (++monthNumber > 12) {
        monthNumber = 1;
        yearNumber++;
      }
      if (monthcount > 12) {
        if (buydownInterestRate >= interestRate) {
          buydownInterestRate = interestRate;
        } else {
          buydownInterestRate++;
          monthcount = 1;
        }
      }

      rate = interestRate / 1200;
      buydownRate = buydownInterestRate / 1200;
      totalMonthlyPayment = this.getMonthlyPayment(
        loanAmount,
        interestRate,
        months
      );
      totalBuydownMonthlyPayment = this.getMonthlyPayment(
        loanAmount,
        buydownInterestRate,
        months
      );
      interestPaid = balance * rate;
      principalPaid = totalMonthlyPayment - interestPaid;
      buydownInterestPaid = totalBuydownMonthlyPayment - principalPaid;
      totalInterest += buydownInterestPaid;
      totalPrincipalPaid += principalPaid;
      balance -= principalPaid;
      buydownamount = interestPaid - buydownInterestPaid;
      if (buydownamount > 0) {
        totalbuydownamount += buydownamount;
      }
      if (balance <= 0) {
        totalMonthlyPayment += balance;
        principalPaid = totalMonthlyPayment - interestPaid;
        balance = 0;
      }
      amortData[i] = this.amortRowClass(
        yearNumber,
        this.DateFormat(monthNumber),
        totalBuydownMonthlyPayment.toFixed(2),
        principalPaid.toFixed(2),
        totalPrincipalPaid.toFixed(2),
        buydownInterestPaid.toFixed(2),
        totalInterest.toFixed(2),
        balance.toFixed(2),
        buydownamount.toFixed(2)
      );

      if (balance <= 0) break;

      monthcount++;
    }

    var loanFormat = loanAmount
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var data = {
      monthlyPayment: monthlyPayment.toFixed(2),
      amortization: amortData,
      error: errormsg,
      loanFormat: loanFormat,
      totalbuydownamount: totalbuydownamount
    };

    return data;
  }
  DateFormat(month, year) {
    var tblDate;
    var month_name = [
      "Jan.",
      "Feb.",
      "Mar.",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec."
    ];
    var monthInteger = parseInt(month);
    if (year) tblDate = month_name[monthInteger - 1] + "&nbsp;" + year;
    else tblDate = month_name[monthInteger - 1];
    return tblDate;
  }
}

function MainForm() {
  const [validated, setValidated] = React.useState(false);
  const [totalBuyDownFee, setTotalBuyDownFee] = React.useState({
    total: 0,
    you: 0,
    them: 0
  });
  const tabs = {
    highcharts: {
      column: {
        Interest: "#094c7b",
        Principal: "#a9cfdf"
      },
      pie: {
        Principal: "#e3a577",
        Interest: "#094c7b",
        Taxes: "#a9cfdf",
        Insurance: "#016890"
      }
    }
  };
  const advancedBuydoown = (data) => {
    const logicMethods = new LogicalCalculation();
    return new Promise((resolve, reject) => {
      const pprice = data.loanAmount,
        term = data.term,
        months = term * 12,
        interestrate = data.interestRate / 100,
        proptax = data.propertyTax,
        homeownersins = data.homeowners,
        thirsPartycontributionPercent = Number(data.contributionBuydownFee),
        type = parseInt(data.mode);

      const yearselected = data.yearselected,
        bdinterest = data.interestRate - (type - (yearselected - 1)),
        principalpaidforyear = (100).toFixed(2),
        bdinterestrate = bdinterest / 100,
        taxamt = Number(proptax / 12),
        insamt = Number(homeownersins / 12),
        printerest = Number(
          logicMethods
            .pmt(
              interestrate / 12,
              term * 12,
              -Math.abs(pprice - pprice * 0),
              0,
              0
            )
            .toFixed(2)
        ),
        bdprinterest = Number(
          logicMethods
            .pmt(
              bdinterestrate / 12,
              term * 12,
              -Math.abs(pprice - pprice * 0),
              0,
              0
            )
            .toFixed(2)
        ),
        totalpayment = (taxamt + insamt + printerest).toFixed(2),
        totalbdpayment = (taxamt + insamt + bdprinterest).toFixed(2),
        loanamt = pprice,
        totalMonthlyPayment = logicMethods.getMonthlyPayment(
          loanamt,
          interestrate,
          months
        ),
        interestpaid = Number(loanamt) * (interestrate / 1200),
        interest = ((Number(loanamt) * interestrate) / 12).toFixed(2),
        principal = (
          Number(totalpayment) -
          Number(interest) -
          Number(taxamt) -
          Number(insamt)
        ).toFixed(2),
        bdinterestamt = (
          Number(totalbdpayment) -
          Number(principal) -
          Number(taxamt) -
          Number(insamt)
        ).toFixed(2),
        amortdata = logicMethods.AmortizationComputeBuydown(
          loanamt,
          data.interestRate,
          months,
          type
        ),
        total = amortdata.monthlyPayment,
        bdThirdParty = Number(loanamt) * (thirsPartycontributionPercent / 100),
        bdYou = amortdata.totalbuydownamount.toFixed(2) - Number(bdThirdParty);
      
      setTotalBuyDownFee({
        total: Currency(amortdata.totalbuydownamount,{ separator: ",",formatWithSymbol: true, precision: 0}).format(),
        them: Currency(bdThirdParty,{ separator: ",",formatWithSymbol: true, precision: 0}).format(),
        you: Currency(bdYou,{ separator: ",",formatWithSymbol: true, precision: 0}).format()
      });

      console.log(amortdata);
      const pieColors = (() => {
        var colors = [
          tabs.highcharts.pie.Principal,
          tabs.highcharts.pie.Interest,
          tabs.highcharts.pie.Taxes,
          tabs.highcharts.pie.Insurance
        ];
        return colors;
      })();
      let categories = [],
        PrincipalData = [],
        InterestData = [];

      for (let i = 0; i <= type; i++) {
        categories.push("Year " + (i + 1));
        PrincipalData.push(
          Number(
            amortdata.amortization[i * 12].principalPaid
              .replace("$", "")
              .replace(/,/g, "")
          )
        );
        InterestData.push(
          Number(
            amortdata.amortization[i * 12].interest
              .replace("$", "")
              .replace(/,/g, "")
          )
        );
      }
      new Highcharts.Chart({
        chart: {
          type: "pie",
          height: 340,
          backgroundColor: "transparent",
          marginTop: 50,
          marginBottom: 50,
          renderTo: "doughnutChart"
        },

        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
          symbolHeight: 14,
          symbolWidth: 14,
          symbolRadius: 6,
          lineHeight: 24,
          itemMarginTop: 10,
          itemMarginBottom: 10,
          useHTML: true,
          labelFormatter: function () {
            return (
              '<div class="chart__legend large"><span class="chart__title">' +
              this.name +
              '</span><span class="chart__value"> ' +
              Currency(this.id, { separator: ",", precision: 0 }).format() +
              "</span></div>"
            );
          }
        },
        title: {
          useHTML: true,
          text:
            '<div class="titlediv secondtitle">For year <span class="firsttitle" style="color:' +
            tabs.highlightedTextColorLight +
            '">' +
            yearselected +
            '</span>, your monthly payment will be <span class="firsttitle" style="color:' +
            tabs.highcharts.column.Principal +
            '">' +
            Currency(totalbdpayment, {
              symbol: "$",
              separator: ",",
              formatWithSymbol: true,
              precision: 0
            }).format() +
            '</span>, based on a reduced interest rate of <span class="firsttitle" style="color:' +
            tabs.highcharts.column.Principal +
            '">' +
            bdinterest +
            "%</span></div>",
          align: "center",
          backgroundColor: "#EFEFEF",
          marginTop: 50
        },

        plotOptions: {
          pie: {
            innerSize: 120,
            size: 180,
            allowPointSelect: true,
            colors: pieColors,
            cursor: "pointer",
            dataLabels: {
              overflow: "allow",
              crop: false,
              enabled: false,
              verticalAlign: "top",
              format: "{point.percentage:.1f} %",
              style: {
                color: "#888888",
                fontSize: "12px"
              }
            },
            showInLegend: true,
            borderWidth: 0,
            series: {
              allowPointSelect: true
            }
          }
        },
        tooltip: {
          headerFormat: "",
          useHTML: true,
          borderColor: "transparent",
          borderRadius: 5,
          backgroundColor: "#ffffff",
          padding: 10,
          shadow: false,
          pointFormatter: function () {
            return (
              '<span class="legend-list"><span style="color:' +
              this.color +
              ';font-size: 16px;">\u25CF</span> <b> ' +
              this.name +
              "</b> - " +
              Currency(this.id, {
                symbol: "$",
                separator: ",",
                formatWithSymbol: true,
                precision: 0
              }).format() +
              " </span>"
            );
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 450
              },
              chartOptions: {
                plotOptions: {
                  pie: {
                    visible: false
                  }
                },
                legend: {
                  align: "left",
                  verticalAlign: "bottom",
                  layout: "vertical"
                },
                title: {
                  marginTop: 100,
                  marginBottom: 100
                },
                chart: {
                  type: "pie",
                  height: 300,
                  marginTop: 100,
                  events: {}
                }
              }
            }
          ]
        },
        series: [
          {
            name: "Percent",
            colorByPoint: true,
            data: [
              {
                name: "Principal", //+ numberWithCommas(principal),
                y:
                  amortdata.amortization[(yearselected - 1) * 12]
                    .principalPaid / 1,
                id:
                  amortdata.amortization[(yearselected - 1) * 12].principalPaid
              },
              {
                name: "Interest", //+ numberWithCommas(interest),
                y: bdinterestamt / 1,
                id: bdinterestamt
              },
              {
                name: "Taxes", //+ taxamt.toFixed(2),
                y: taxamt / 1,
                id: Currency(taxamt, { separator: ",", precision: 0 }).format()
              },
              {
                name: "Insurance", //+ insamt.toFixed(2),
                y: insamt / 1,
                id: Currency(insamt, { separator: ",", precision: 0 }).format()
              }
            ]
          }
        ]
      });
      new Highcharts.Chart({
        chart: {
          plotBackgroundColor: "#ffffff",
          backgroundColor: "transparent",
          type: "column",
          height: 420,
          marginTop: 80,
          renderTo: "barChart"
        },
        title: {
          style: {
            display: "none"
          }
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          min: 0,
          title: {
            text: ""
          }
        },
        tooltip: {
          headerFormat: "",
          useHTML: true,
          borderColor: "transparent",
          borderRadius: 5,
          backgroundColor: "#ffffff",
          padding: 10,
          shadow: false,
          pointFormat:
            '<span class="legend-list"><span style="color:{point.color};font-size: 16px;">\u25CF</span> <b> {series.name}</b> : {point.y}  <span class="small">({point.percentage:.0f}%)</span></span>',
          shared: true,
          pointFormatter: function () {
            return (
              '<span class="legend-list"><span style="color:' +
              this.color +
              ';font-size: 16px;">\u25CF</span> <b> ' +
              this.series.name +
              "</b> : " +
              Currency(this.y, {
                symbol: "$",
                separator: ",",
                formatWithSymbol: true,
                precision: 0
              }).format() +
              ' <span class="small">(' +
              Math.round(this.percentage) +
              "%)</span></span>"
            );
          }
        },
        legend: {
          enabled: false,
          y: 50,
          align: "center",
          verticalAlign: "top",
          layout: "vertical",
          symbolHeight: 12,
          symbolWidth: 12,
          symbolRadius: 6,
          useHTML: true,
          floating: true,
          labelFormatter: function () {
            return (
              '<div style=""><span class="legenddtitle">' +
              this.name +
              "</span></div>"
            );
          }
        },
        plotOptions: {
          column: {
            stacking: "normal",
            showInLegend: true,
            allowPointSelect: true,
            borderWidth: 0
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                minwidth: 100,
                maxWidth: 400
              },
              chartOptions: {
                chart: {
                  height: 250,
                  marginTop: 20,
                  marginBotom: 20
                },
                legend: {
                  y: 90,
                  align: "center",
                  layout: "horizontal",
                  verticalAlign: "top",
                  useHTML: true,
                  floating: true,
                  labelFormatter: function () {
                    return (
                      '<div style="width:50px;"><span class="legenddtitle">' +
                      this.name +
                      "</span></div>"
                    );
                  }
                },
                title: {
                  style: {
                    display: "none"
                  }
                }
              }
            }
          ]
        },
        series: [
          {
            name: "Interest",
            data: InterestData,
            color: tabs.highcharts.column.Interest
          },
          {
            name: "Principal",
            data: PrincipalData,
            color: tabs.highcharts.column.Principal
          }
        ]
      });

      resolve(true);
    });
  };
  const [buyDownParameters, setBuyDownParameters] = React.useState({
    contributionBuydownFee: 2,
    homeowners: 900,
    interestRate: 5.875,
    loanAmount: 250000,
    mode: "3",
    propertyTax: 2700,
    term: 30,
    yearselected: "1"
  });
  React.useEffect(() => {
    advancedBuydoown(buyDownParameters);
  }, [buyDownParameters]);
  
  const varValidator = (validStr) => {
    return validStr ? Number(validStr.replaceAll(',', '')) : undefined;
  }
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setBuyDownParameters((prev) => ({
        ...prev,
        contributionBuydownFee: varValidator(
          event.target.elements.ThirdpartyContribution.value
        ),
        homeowners: varValidator(event.target.elements.HomeownersIns.value),
        interestRate: varValidator(event.target.elements.interestRate.value),
        loanAmount: varValidator(event.target.elements.loanAmount.value),
        propertyTax: varValidator(event.target.elements.propertyTax.value),
        term: varValidator(event.target.elements.term.value),
        yearselected: "1"
      }));
    }
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
  };

  const setMode = (mode) => {
    setBuyDownParameters((prev) => ({ ...prev, mode, yearselected: "1" }));
  };
  
  const setYearSelected = (yearselected) => {
    setBuyDownParameters((prev) => ({ ...prev, yearselected}));
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="m-3">
          <DropdownButton
            variant="success"
            id="dropdownBasic"
            title="3/2/1 BUYDOWN"
          >
            <Dropdown.Item onClick={(e) => setMode("3")}>
              3/2/1 BUYDOWN
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setMode("2")}>
              2/1 BUYDOWN
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setMode("1")}>
              1/0 BUYDOWN
            </Dropdown.Item>
          </DropdownButton>
        </Row>
        <Row className="mb-3">
          <Form.Group
            className="cell-margin"
            as={Col}
            md="6"
            lg="4"
            controlId="validationCustom01"
          >
            <Form.Label>Loan Amount</Form.Label>
            <InputGroup hasValidation={true}>
              <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
              <NumberFormat
                id="loanAmount"
                value={buyDownParameters.loanAmount}
                thousandSeparator={true}
                className="form-control"
                inputmode="numeric"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Loan Amount.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group
            className="cell-margin"
            as={Col}
            md="6"
            lg="2"
            controlId="validationCustom01"
          >
            <Form.Label>Term (Yrs)</Form.Label>
            <NumberFormat
              id="term"
              value={buyDownParameters.term}
              thousandSeparator={false}
              className="form-control"
              inputmode="numeric"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please Enter a Term.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="cell-margin"
            as={Col}
            md="6"
            lg="2"
            controlId="validationCustom01"
          >
            <Form.Label>Interest Rate (%)</Form.Label>
            <NumberFormat
              id="interestRate"
              value={buyDownParameters.interestRate}
              decimalScale={3}
              className="form-control"
              inputmode="numeric"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a rate between 3.01% and 15%
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="cell-margin"
            as={Col}
            md="6"
            lg="4"
            controlId="validationCustom01"
          >
            <Form.Label>Property Tax (Yearly)</Form.Label>
            <InputGroup hasValidation={true}>
              <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
              <NumberFormat
                id="propertyTax"
                value={buyDownParameters.propertyTax}
                thousandSeparator={true}
                className="form-control"
                inputmode="numeric"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Property Tax.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="6"
            lg="5"
            controlId="validationCustom03"
            className="cell-margin"
          >
            <Form.Label>Homeowners Ins. (Yearly)</Form.Label>
            <InputGroup hasValidation={true}>
              <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
              <NumberFormat
                id="HomeownersIns"
                value={buyDownParameters.homeowners}
                thousandSeparator={true}
                className="form-control"
                inputmode="numeric"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a Homeowners Ins.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            lg="5"
            className="cell-margin"
            controlId="validationCustom04"
          >
            <Form.Label>
              Third-party Contribution toward Buydown Fee (% of Loan Amount)
            </Form.Label>
            <NumberFormat
              id="ThirdpartyContribution"
              value={buyDownParameters.contributionBuydownFee}
              decimalScale={3}
              className="form-control"
              inputmode="numeric"
              isAllowed={(values) => {
                const {floatValue} = values;
                return floatValue === "" || (floatValue >= 1 &&  floatValue <= 100);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a number between, 1 and 100
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            as={Col}
            md="2"
            className="cell-margin d-flex mt-4"
            controlId="validationCustom04"
          >
            <Button type="submit">Calculate</Button>
          </Form.Group>
        </Row>
      </Form>
      <div className="seperator m-3" />
      <div className="total-buy-down m-3">
        <p>Total buy down fee for this loan is</p>
        <h2>
          <i></i>{" "}
          <span
            className="total-buydown-amount c-blue"
            style={{ marginLeft: "0.5rem" }}
          >
            {(totalBuyDownFee.total)}
          </span>
          <span>
            <small>*</small>
          </span>
        </h2>
        <p>
          <span
            data-result="bdThirdParty"
            className="c-blue"
            style={{ marginLeft: "0.5rem" }}
          >
                          {(totalBuyDownFee.them)}
          </span>{" "}
          is paid by a third-party, and{" "}
          <span
            data-result="bdYou"
            className="c-blue"
            calculator-highlightedtextcolor=""
          >
            {(totalBuyDownFee.you)}
          </span>{" "}
          is paid by you.
        </p>
      </div>
      <div className="seperator m-3" />
      <div className="charts-container">
        <Row>
          <Col md="6">
            <div className="doughnut-chart-container">
              <h3 className="doughnut-chart-text">
                See your lower monthly payment for the first years of the loan.
                Select Year:
                <select onChange={(e)=> setYearSelected(e.target.value)} title="Chart Types" value={buyDownParameters.yearselected} class="default-select">
                  <option value="1" selected="">
                    1
                  </option>
                  <option value="2">2</option>
                  {(buyDownParameters.mode === "3" ||
                    buyDownParameters.mode === "2") && (
                    <option value="3">3</option>
                  )}
                  {buyDownParameters.mode === "3" && (
                    <option value="4">4</option>
                  )}
                </select>
              </h3>
              <div id="doughnutChart"></div>
            </div>
          </Col>
          <Col md="6">
            <div className="bar-chart-container" id="barChart">
              {" "}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

const BuyDownCalc = () => {
  return (
    <>
      <MainForm />
    </>
  );
};

ReactDOM.render(<BuyDownCalc />, document.getElementById("root"));
