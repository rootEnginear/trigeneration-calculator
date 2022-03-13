const __R = 0.461526 // kJ/(kg K)
const __tc = 647.096
const __rhoc = 322

// passthrough
const fromSIunit_h = (Ins: number) => Ins
const toSIunit_h = (Ins: number) => Ins

// passthrough
const fromSIunit_s = (Ins: number) => Ins
const toSIunit_s = (Ins: number) => Ins

// Translate bar to MPa
const fromSIunit_p = (Ins: number) => Ins * 10
const toSIunit_p = (Ins: number) => Ins / 10

// Translate Kelvin to degC
const fromSIunit_T = (Ins: number) => Ins - 273.15
const toSIunit_T = (Ins: number) => Ins + 273.15

// Release on the IAPWS Industrial Formulation 1997
// for the Thermodynamic Properties of Water and Steam 1997
// Section 4 Auxiliary Equation for the Boundary between Regions 2 and 3
// Eq 6, Page 6
const B23T_p = (p: number) => 572.54459862746 + ((p - 13.91883977887) / 1.0192970039326E-03) ** 0.5

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 1997
// Section 4 Auxiliary Equation for the Boundary between Regions 2 and 3
// Eq 5, Page 5
const B23p_T = (T: number) =>
  348.05185628969 -
  1.1671859879975 * T +
  1.0192970039326E-03 * T ** 2

const h_ps = (p: number, s: number) => {
  p = toSIunit_p(p)
  s = toSIunit_s(s)
  switch (region_ps(p, s)) {
  case 1: return fromSIunit_h(h1_pT(p, T1_ps(p, s)))
  case 2: return fromSIunit_h(h2_pT(p, T2_ps(p, s)))
  case 3: return fromSIunit_h(h3_rhoT(1 / v3_ps(p, s), T3_ps(p, s)))
  case 4: {
    const xs = x4_ps(p, s)
    return fromSIunit_h(xs * h4V_p(p) + (1 - xs) * h4L_p(p))
  }
  case 5: return fromSIunit_h(h5_pT(p, T5_ps(p, s)))
  default: throw new Error('value error')
  }
}

const h_pT = (p: number, T: number) => {
  p = toSIunit_p(p)
  T = toSIunit_T(T)
  switch (region_pT(p, T)) {
  case 1: return fromSIunit_h(h1_pT(p, T))
  case 2: return fromSIunit_h(h2_pT(p, T))
  case 3: return fromSIunit_h(h3_pT(p, T))
  case 5: return fromSIunit_h(h5_pT(p, T))
  default: throw new Error('value error')
  }
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 5 Equations for Region 1, Section. 5.1 Basic Equation
// Eqution 7, Table 3, Page 6
const h1_pT_I1 = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 8, 8, 21, 23, 29, 30, 31, 32]
const h1_pT_J1 = [-2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5, -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41]
const h1_pT_n1 = [0.14632971213167, -0.84548187169114, -3.756360367204, 3.3855169168385, -0.95791963387872, 0.15772038513228, -0.016616417199501, 8.1214629983568E-04, 2.8319080123804E-04, -6.0706301565874E-04, -0.018990068218419, -0.032529748770505, -0.021841717175414, -5.283835796993E-05, -4.7184321073267E-04, -3.0001780793026E-04, 4.7661393906987E-05, -4.4141845330846E-06, -7.2694996297594E-16, -3.1679644845054E-05, -2.8270797985312E-06, -8.5205128120103E-10, -2.2425281908E-06, -6.5171222895601E-07, -1.4341729937924E-13, -4.0516996860117E-07, -1.2734301741641E-09, -1.7424871230634E-10, -6.8762131295531E-19, 1.4478307828521E-20, 2.6335781662795E-23, -1.1947622640071E-23, 1.8228094581404E-24, -9.3537087292458E-26]

const h1_pT = (p: number, T: number) => {
  const ps = p / 16.53
  const tau = 1386 / T
  let g_tau = 0
  for (let i = 0; i <= 33; i += 1)
    g_tau +=
      h1_pT_n1[i] * (7.1 - ps) ** h1_pT_I1[i] *
      h1_pT_J1[i] * (tau - 1.222) ** (h1_pT_J1[i] - 1)
  return __R * T * tau * g_tau
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 6 Equations for Region 2, Section. 6.1 Basic Equation
// Table 11 and 12, Page 14 and 15
const h2_pT_J0 = [0, 1, -5, -4, -3, -2, -1, 2, 3]
const h2_pT_n0 = [-9.6927686500217, 10.086655968018, -0.005608791128302, 0.071452738081455, -0.40710498223928, 1.4240819171444, -4.383951131945, -0.28408632460772, 0.021268463753307]

const h2_pT_Ir = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 10, 10, 10, 16, 16, 18, 20, 20, 20, 21, 22, 23, 24, 24, 24]
const h2_pT_Jr = [0, 1, 2, 3, 6, 1, 2, 4, 7, 36, 0, 1, 3, 6, 35, 1, 2, 3, 7, 3, 16, 35, 0, 11, 25, 8, 36, 13, 4, 10, 14, 29, 50, 57, 20, 35, 48, 21, 53, 39, 26, 40, 58]
const h2_pT_nr = [-1.7731742473213E-03, -0.017834862292358, -0.045996013696365, -0.057581259083432, -0.05032527872793, -3.3032641670203E-05, -1.8948987516315E-04, -3.9392777243355E-03, -0.043797295650573, -2.6674547914087E-05, 2.0481737692309E-08, 4.3870667284435E-07, -3.227767723857E-05, -1.5033924542148E-03, -0.040668253562649, -7.8847309559367E-10, 1.2790717852285E-08, 4.8225372718507E-07, 2.2922076337661E-06, -1.6714766451061E-11, -2.1171472321355E-03, -23.895741934104, -5.905956432427E-18, -1.2621808899101E-06, -0.038946842435739, 1.1256211360459E-11, -8.2311340897998, 1.9809712802088E-08, 1.0406965210174E-19, -1.0234747095929E-13, -1.0018179379511E-09, -8.0882908646985E-11, 0.10693031879409, -0.33662250574171, 8.9185845355421E-25, 3.0629316876232E-13, -4.2002467698208E-06, -5.9056029685639E-26, 3.7826947613457E-06, -1.2768608934681E-15, 7.3087610595061E-29, 5.5414715350778E-17, -9.436970724121E-07]

const h2_pT = (p: number, T: number) => {
  const tau = 540 / T
  let g0_tau = 0, gr_tau = 0
  for (let i = 0; i <= 8; i += 1)
    g0_tau += h2_pT_n0[i] * h2_pT_J0[i] * tau ** (h2_pT_J0[i] - 1)
  for (let i = 0; i <= 42; i += 1)
    gr_tau +=
      h2_pT_nr[i] * p ** h2_pT_Ir[i] *
      h2_pT_Jr[i] * (tau - 0.5) ** (h2_pT_Jr[i] - 1)
  return __R * T * tau * (g0_tau + gr_tau)
}

const h3_pT = (p: number, T: number) => {
  // Not avalible with IF 97
  // Solve function T3_ph - T = 0 with half interval method.
  let Low_Bound = 0, High_Bound = 0
  if (p < 22.06395) {
    // Bellow tripple point
    const Ts = T4_p(p) // Saturation temperature
    if (T <= Ts) {
      // Liquid side
      High_Bound = h4L_p(p) // Max h är liauid h.
      Low_Bound = h1_pT(p, 623.15)
    } else {
      Low_Bound = h4V_p(p) // Min h är Vapour h.
      High_Bound = h2_pT(p, B23T_p(p))
    }
  } else {
    // Above tripple point. R3 from R2 till R3.
    Low_Bound = h1_pT(p, 623.15)
    High_Bound = h2_pT(p, B23T_p(p))
  }
  let hs = (Low_Bound + High_Bound) / 2, Ts = T + 1
  while (Math.abs(T - Ts) > 0.000001) {
    hs = (Low_Bound + High_Bound) / 2
    Ts = T3_ph(p, hs)
    if (Ts > T)
      High_Bound = hs
    else
      Low_Bound = hs
  }
  return hs
}

const h4L_p = (p: number) => {
  if (p > 0.000611657 && p < 22.06395) {
    if (p < 16.529) return h1_pT(p, T4_p(p))
    // Iterate to find the the backward solution of p3sat_h
    let Low_Bound = 1670.858218, High_Bound = 2087.23500164864
    let hs = (Low_Bound + High_Bound) / 2, ps = 0
    while (Math.abs(p - ps) > 0.00001) {
      hs = (Low_Bound + High_Bound) / 2
      ps = p3sat_h(hs)
      if (ps > p)
        High_Bound = hs
      else
        Low_Bound = hs
    }
    return hs
  }
  throw new Error('value error')
}

const h4V_p = (p: number) => {
  if (p > 0.000611657 && p < 22.06395) {
    if (p < 16.529) return h2_pT(p, T4_p(p))
    // Iterate to find the the backward solution of p3sat_h
    let Low_Bound = 2087.23500164864, High_Bound = 2563.592004 + 5 // 5 added to extrapolate to ensure even the border ==350°C solved.
    let hs = (Low_Bound + High_Bound) / 2, ps = 0
    while (Math.abs(p - ps) > 0.00001) {
      hs = (Low_Bound + High_Bound) / 2
      ps = p3sat_h(hs)
      if (ps < p)
        High_Bound = hs
      else
        Low_Bound = hs
    }
    return hs
  }
  throw new Error('value error')
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 7 Basic Equation for Region 3, Section. 6.1 Basic Equation
// Table 30 and 31, Page 30 and 31
const h3_rhoT_Ii = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 8, 9, 9, 10, 10, 11]
const h3_rhoT_Ji = [0, 0, 1, 2, 7, 10, 12, 23, 2, 6, 15, 17, 0, 2, 6, 7, 22, 26, 0, 2, 4, 16, 26, 0, 2, 4, 26, 1, 3, 26, 0, 2, 26, 2, 26, 2, 26, 0, 1, 26]
const h3_rhoT_ni = [1.0658070028513, -15.732845290239, 20.944396974307, -7.6867707878716, 2.6185947787954, -2.808078114862, 1.2053369696517, -8.4566812812502E-03, -1.2654315477714, -1.1524407806681, 0.88521043984318, -0.64207765181607, 0.38493460186671, -0.85214708824206, 4.8972281541877, -3.0502617256965, 0.039420536879154, 0.12558408424308, -0.2799932969871, 1.389979956946, -2.018991502357, -8.2147637173963E-03, -0.47596035734923, 0.0439840744735, -0.44476435428739, 0.90572070719733, 0.70522450087967, 0.10770512626332, -0.32913623258954, -0.50871062041158, -0.022175400873096, 0.094260751665092, 0.16436278447961, -0.013503372241348, -0.014834345352472, 5.7922953628084E-04, 3.2308904703711E-03, 8.0964802996215E-05, -1.6557679795037E-04, -4.4923899061815E-05]

const h3_rhoT = (rho: number, T: number) => {
  const delta = rho / __rhoc
  const tau = __tc / T
  let fi_delta = 0
  let fi_tau = 0
  for (let i = 0; i <= 39; i += 1) {
    fi_delta +=
      h3_rhoT_ni[i] *
      h3_rhoT_Ii[i] *
      delta ** (h3_rhoT_Ii[i] - 1) *
      tau ** h3_rhoT_Ji[i]
    fi_tau +=
      h3_rhoT_ni[i] *
      delta ** h3_rhoT_Ii[i] * h3_rhoT_Ji[i] *
      tau ** (h3_rhoT_Ji[i] - 1)
  }
  fi_delta += h3_rhoT_ni[0] / delta
  return __R * T * (tau * fi_tau + delta * fi_delta)
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// Basic Equation for Region 5
// Eq 32,33, Page 36, Tables 37-41
const h5_pT_Ji0 = [0, 1, -3, -2, -1, 2]
const h5_pT_ni0 = [-13.179983674201, 6.8540841634434, -0.024805148933466, 0.36901534980333, -3.1161318213925, -0.32961626538917]

const h5_pT_Iir = [1, 1, 1, 2, 3]
const h5_pT_Jir = [0, 1, 3, 9, 3]
const h5_pT_nir = [-1.2563183589592E-04, 2.1774678714571E-03, -0.004594282089991, -3.9724828359569E-06, 1.2919228289784E-07]

const h5_pT = (p: number, T: number) => {
  const tau = 1000 / T
  let g0_tau = 0, gr_tau = 0
  for (let i = 0; i <= 5; i += 1)
    g0_tau += h5_pT_ni0[i] * h5_pT_Ji0[i] * tau ** (h5_pT_Ji0[i] - 1)
  for (let i = 0; i <= 4; i += 1)
    gr_tau +=
      h5_pT_nir[i] * p ** h5_pT_Iir[i] *
      h5_pT_Jir[i] * tau ** (h5_pT_Jir[i] - 1)
  return __R * T * tau * (g0_tau + gr_tau)
}


// Revised Supplementary Release on Backward Equations for the Functions T(p,h), v(p,h) and T(p,s), v(p,s)
// for Region 3 of the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 2004
// Section 4 Boundary Equations psat(h) and psat(s) for the Saturation Lines of Region 3
// Se pictures Page 17, Eq 10, Table 17, Page 18
const p3sat_h_Ii = [0, 1, 1, 1, 1, 5, 7, 8, 14, 20, 22, 24, 28, 36]
const p3sat_h_Ji = [0, 1, 3, 4, 36, 3, 0, 24, 16, 16, 3, 18, 8, 24]
const p3sat_h_ni = [0.600073641753024, -9.36203654849857, 24.6590798594147, -107.014222858224, -91582131580576.8, -8623.32011700662, -23.5837344740032, 2.52304969384128E+17, -3.89718771997719E+18, -3.33775713645296E+22, 35649946963.6328, -1.48547544720641E+26, 3.30611514838798E+18, 8.13641294467829E+37]

const p3sat_h = (h: number) => {
  const hs = h / 2600
  let ps = 0
  for (let i = 0; i <= 13; i += 1)
    ps +=
      p3sat_h_ni[i] *
      (hs - 1.02) ** p3sat_h_Ii[i] *
      (hs - 0.608) ** p3sat_h_Ji[i]
  return ps * 22
}

const p3sat_s_Ii = [0, 1, 1, 4, 12, 12, 16, 24, 28, 32]
const p3sat_s_Ji = [0, 1, 32, 7, 4, 14, 36, 10, 0, 18]
const p3sat_s_ni = [0.639767553612785, -12.9727445396014, -2.24595125848403E+15, 1774667.41801846, 7170793495.71538, -3.78829107169011E+17, -9.55586736431328E+34, 1.87269814676188E+23, 119254746466.473, 1.10649277244882E+36]

const p3sat_s = (s: number) => {
  const sigma = s / 5.2
  let p = 0
  for (let i = 0; i <= 9; i += 1)
    p +=
      p3sat_s_ni[i] *
      (sigma - 1.03) ** p3sat_s_Ii[i] *
      (sigma - 0.699) ** p3sat_s_Ji[i]
  return p * 22
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// Section 8.1 The Saturation-Pressure Equation
// Eq 30, Page 33
const p4_T = (T: number) => {
  const teta = T - 0.23855557567849 / (T - 650.17534844798)
  const a =
    teta ** 2 + 1167.0521452767 *
    teta - 724213.16703206
  const b =
    -17.073846940092 * teta ** 2 +
    12020.82470247 * teta -
    3232555.0322333
  const c =
    14.91510861353 * teta ** 2 -
    4823.2657361591 * teta +
    405113.40542057
  return (2 * c / (-b + (b ** 2 - 4 * a * c) ** 0.5)) ** 4
}

const s_pT = (p: number, T: number) => {
  p = toSIunit_p(p)
  T = toSIunit_T(T)
  switch (region_pT(p, T)) {
  case 1: return fromSIunit_s(s1_pT(p, T))
  case 2: return fromSIunit_s(s2_pT(p, T))
  case 3: return fromSIunit_s(s3_rhoT(1 / v3_ph(p, h3_pT(p, T)), T))
  case 5: return fromSIunit_s(s5_pT(p, T))
  default: throw new Error('value error')
  }
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 5 Equations for Region 1, Section. 5.1 Basic Equation
// Eqution 7, Table 3, Page 6
const s1_pT_I1 = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 8, 8, 21, 23, 29, 30, 31, 32]
const s1_pT_J1 = [-2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5, -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41]
const s1_pT_n1 = [0.14632971213167, -0.84548187169114, -3.756360367204, 3.3855169168385, -0.95791963387872, 0.15772038513228, -0.016616417199501, 8.1214629983568E-04, 2.8319080123804E-04, -6.0706301565874E-04, -0.018990068218419, -0.032529748770505, -0.021841717175414, -5.283835796993E-05, -4.7184321073267E-04, -3.0001780793026E-04, 4.7661393906987E-05, -4.4141845330846E-06, -7.2694996297594E-16, -3.1679644845054E-05, -2.8270797985312E-06, -8.5205128120103E-10, -2.2425281908E-06, -6.5171222895601E-07, -1.4341729937924E-13, -4.0516996860117E-07, -1.2734301741641E-09, -1.7424871230634E-10, -6.8762131295531E-19, 1.4478307828521E-20, 2.6335781662795E-23, -1.1947622640071E-23, 1.8228094581404E-24, -9.3537087292458E-26]

const s1_pT = (p: number, T: number) => {
  p = p / 16.53
  T = 1386 / T
  let g = 0, g_t = 0
  for (let i = 0; i <= 33; i += 1) {
    g_t +=
      s1_pT_n1[i] * (7.1 - p) ** s1_pT_I1[i] *
      s1_pT_J1[i] * (T - 1.222) ** (s1_pT_J1[i] - 1)
    g +=
      s1_pT_n1[i] *
      (7.1 - p) ** s1_pT_I1[i] *
      (T - 1.222) ** s1_pT_J1[i]
  }
  return __R * T * g_t - __R * g
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 6 Equations for Region 2, Section. 6.1 Basic Equation
// Table 11 and 12, Page 14 and 15
const s2_pT_J0 = [0, 1, -5, -4, -3, -2, -1, 2, 3]
const s2_pT_n0 = [-9.6927686500217, 10.086655968018, -0.005608791128302, 0.071452738081455, -0.40710498223928, 1.4240819171444, -4.383951131945, -0.28408632460772, 0.021268463753307]

const s2_pT_Ir = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 10, 10, 10, 16, 16, 18, 20, 20, 20, 21, 22, 23, 24, 24, 24]
const s2_pT_Jr = [0, 1, 2, 3, 6, 1, 2, 4, 7, 36, 0, 1, 3, 6, 35, 1, 2, 3, 7, 3, 16, 35, 0, 11, 25, 8, 36, 13, 4, 10, 14, 29, 50, 57, 20, 35, 48, 21, 53, 39, 26, 40, 58]
const s2_pT_nr = [-1.7731742473213E-03, -0.017834862292358, -0.045996013696365, -0.057581259083432, -0.05032527872793, -3.3032641670203E-05, -1.8948987516315E-04, -3.9392777243355E-03, -0.043797295650573, -2.6674547914087E-05, 2.0481737692309E-08, 4.3870667284435E-07, -3.227767723857E-05, -1.5033924542148E-03, -0.040668253562649, -7.8847309559367E-10, 1.2790717852285E-08, 4.8225372718507E-07, 2.2922076337661E-06, -1.6714766451061E-11, -2.1171472321355E-03, -23.895741934104, -5.905956432427E-18, -1.2621808899101E-06, -0.038946842435739, 1.1256211360459E-11, -8.2311340897998, 1.9809712802088E-08, 1.0406965210174E-19, -1.0234747095929E-13, -1.0018179379511E-09, -8.0882908646985E-11, 0.10693031879409, -0.33662250574171, 8.9185845355421E-25, 3.0629316876232E-13, -4.2002467698208E-06, -5.9056029685639E-26, 3.7826947613457E-06, -1.2768608934681E-15, 7.3087610595061E-29, 5.5414715350778E-17, -9.436970724121E-07]

const s2_pT = (p: number, T: number) => {
  const tau = 540 / T
  let g0 = Math.log(p), g0_tau = 0
  for (let i = 0; i <= 8; i += 1) {
    g0 += s2_pT_n0[i] * tau ** s2_pT_J0[i]
    g0_tau += s2_pT_n0[i] * s2_pT_J0[i] * tau ** (s2_pT_J0[i] - 1)
  }
  let gr = 0, gr_tau = 0
  for (let i = 0; i <= 42; i += 1) {
    gr +=
      s2_pT_nr[i] *
      p ** s2_pT_Ir[i] *
      (tau - 0.5) ** s2_pT_Jr[i]
    gr_tau +=
      s2_pT_nr[i] *
      p ** s2_pT_Ir[i] * s2_pT_Jr[i] *
      (tau - 0.5) ** (s2_pT_Jr[i] - 1)
  }
  return __R * (tau * (g0_tau + gr_tau) - (g0 + gr))
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 7 Basic Equation for Region 3, Section. 6.1 Basic Equation
// Table 30 and 31, Page 30 and 31
const s3_rhoT_Ii = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 8, 9, 9, 10, 10, 11]
const s3_rhoT_Ji = [0, 0, 1, 2, 7, 10, 12, 23, 2, 6, 15, 17, 0, 2, 6, 7, 22, 26, 0, 2, 4, 16, 26, 0, 2, 4, 26, 1, 3, 26, 0, 2, 26, 2, 26, 2, 26, 0, 1, 26]
const s3_rhoT_ni = [1.0658070028513, -15.732845290239, 20.944396974307, -7.6867707878716, 2.6185947787954, -2.808078114862, 1.2053369696517, -8.4566812812502E-03, -1.2654315477714, -1.1524407806681, 0.88521043984318, -0.64207765181607, 0.38493460186671, -0.85214708824206, 4.8972281541877, -3.0502617256965, 0.039420536879154, 0.12558408424308, -0.2799932969871, 1.389979956946, -2.018991502357, -8.2147637173963E-03, -0.47596035734923, 0.0439840744735, -0.44476435428739, 0.90572070719733, 0.70522450087967, 0.10770512626332, -0.32913623258954, -0.50871062041158, -0.022175400873096, 0.094260751665092, 0.16436278447961, -0.013503372241348, -0.014834345352472, 5.7922953628084E-04, 3.2308904703711E-03, 8.0964802996215E-05, -1.6557679795037E-04, -4.4923899061815E-05]

const s3_rhoT = (rho: number, T: number) => {
  const delta = rho / __rhoc
  const tau = __tc / T
  let fi = 0, fi_tau = 0
  for (let i = 0; i <= 39; i += 1) {
    fi +=
      s3_rhoT_ni[i] *
      delta ** s3_rhoT_Ii[i] *
      tau ** s3_rhoT_Ji[i]
    fi_tau +=
      s3_rhoT_ni[i] *
      delta ** s3_rhoT_Ii[i] * s3_rhoT_Ji[i] *
      tau ** (s3_rhoT_Ji[i] - 1)
  }
  fi += s3_rhoT_ni[0] * Math.log(delta)
  return __R * (tau * fi_tau - fi)
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// Basic Equation for Region 5
// Eq 32,33, Page 36, Tables 37-41
const s5_pT_Ji0 = [0, 1, -3, -2, -1, 2]
const s5_pT_ni0 = [-13.179983674201, 6.8540841634434, -0.024805148933466, 0.36901534980333, -3.1161318213925, -0.32961626538917]

const s5_pT_Iir = [1, 1, 1, 2, 3]
const s5_pT_Jir = [0, 1, 3, 9, 3]
const s5_pT_nir = [-1.2563183589592E-04, 2.1774678714571E-03, -0.004594282089991, -3.9724828359569E-06, 1.2919228289784E-07]

const s5_pT = (p: number, T: number) => {
  const tau = 1000 / T
  let g0 = Math.log(p), g0_tau = 0
  for (let i = 0; i <= 5; i += 1) {
    g0 += s5_pT_ni0[i] * tau ** s5_pT_Ji0[i]
    g0_tau += s5_pT_ni0[i] * s5_pT_Ji0[i] * tau ** (s5_pT_Ji0[i] - 1)
  }
  let gr = 0, gr_tau = 0
  for (let i = 0; i <= 4; i += 1) {
    gr +=
      s5_pT_nir[i] *
      p ** s5_pT_Iir[i] *
      tau ** s5_pT_Jir[i]
    gr_tau +=
      s5_pT_nir[i] *
      p ** s5_pT_Iir[i] * s5_pT_Jir[i] *
      tau ** (s5_pT_Jir[i] - 1)
  }
  return __R * (tau * (g0_tau + gr_tau) - (g0 + gr))
}

const T_ph = (p: number, h: number) => {
  p = toSIunit_p(p)
  h = toSIunit_h(h)
  switch (region_ph(p, h)) {
  case 1: return fromSIunit_T(T1_ph(p, h))
  case 2: return fromSIunit_T(T2_ph(p, h))
  case 3: return fromSIunit_T(T3_ph(p, h))
  case 4: return fromSIunit_T(T4_p(p))
  case 5: return fromSIunit_T(T5_ph(p, h))
  default: throw new Error('value error')
  }
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 5 Equations for Region 1, Section. 5.1 Basic Equation, 5.2.1 The Backward Equation T ( p,h )
// Eqution 11, Table 6, Page 10
const T1_ph_I1 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6]
const T1_ph_J1 = [0, 1, 2, 6, 22, 32, 0, 1, 2, 3, 4, 10, 32, 10, 32, 10, 32, 32, 32, 32]
const T1_ph_n1 = [-238.72489924521, 404.21188637945, 113.49746881718, -5.8457616048039, -1.528548241314E-04, -1.0866707695377E-06, -13.391744872602, 43.211039183559, -54.010067170506, 30.535892203916, -6.5964749423638, 9.3965400878363E-03, 1.157364750534E-07, -2.5858641282073E-05, -4.0644363084799E-09, 6.6456186191635E-08, 8.0670734103027E-11, -9.3477771213947E-13, 5.8265442020601E-15, -1.5020185953503E-17]

const T1_ph = (p: number, h: number) => {
  const hs = h / 2500
  let T = 0
  for (let i = 0; i <= 19; i += 1)
    T +=
      T1_ph_n1[i] *
      p ** T1_ph_I1[i] *
      (hs + 1) ** T1_ph_J1[i]
  return T
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 6 Equations for Region 2,6.3.1 The Backward Equations T( p, h ) for Subregions 2a, 2b, and 2c
const T2_ph = (p: number, h: number) => {
  // Subregion A
  if (p < 4) return T2_ph_A(p, h)
  // Subregion B
  const pb =
    905.84278514723 -
    0.67955786399241 * h +
    1.2809002730136E-04 * h ** 2
  if (p < pb) return T2_ph_B(p, h)
  // Subregion C
  return T2_ph_A(p, h)
}

// Subregion A
// Table 20, Eq 22, page 22
const T2_ph_A_Ji = [0, 1, 2, 3, 7, 20, 0, 1, 2, 3, 7, 9, 11, 18, 44, 0, 2, 7, 36, 38, 40, 42, 44, 24, 44, 12, 32, 44, 32, 36, 42, 34, 44, 28]
const T2_ph_A_Ii = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7]
const T2_ph_A_ni = [1089.8952318288, 849.51654495535, -107.81748091826, 33.153654801263, -7.4232016790248, 11.765048724356, 1.844574935579, -4.1792700549624, 6.2478196935812, -17.344563108114, -200.58176862096, 271.96065473796, -455.11318285818, 3091.9688604755, 252266.40357872, -6.1707422868339E-03, -0.31078046629583, 11.670873077107, 128127984.04046, -985549096.23276, 2822454697.3002, -3594897141.0703, 1722734991.3197, -13551.334240775, 12848734.66465, 1.3865724283226, 235988.32556514, -13105236.545054, 7399.9835474766, -551966.9703006, 3715408.5996233, 19127.72923966, -415351.64835634, -62.459855192507]

const T2_ph_A = (p: number, h: number) => {
  const hs = h / 2000
  let Ts = 0
  for (let i = 0; i <= 33; i += 1)
    Ts +=
      T2_ph_A_ni[i] *
      p ** T2_ph_A_Ii[i] *
      (hs - 2.1) ** T2_ph_A_Ji[i]
  return Ts
}

// Subregion B
// Table 21, Eq 23, page 23
const T2_ph_B_Ji = [0, 1, 2, 12, 18, 24, 28, 40, 0, 2, 6, 12, 18, 24, 28, 40, 2, 8, 18, 40, 1, 2, 12, 24, 2, 12, 18, 24, 28, 40, 18, 24, 40, 28, 2, 28, 1, 40]
const T2_ph_B_Ii = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 7, 7, 9, 9]
const T2_ph_B_ni = [1489.5041079516, 743.07798314034, -97.708318797837, 2.4742464705674, -0.63281320016026, 1.1385952129658, -0.47811863648625, 8.5208123431544E-03, 0.93747147377932, 3.3593118604916, 3.3809355601454, 0.16844539671904, 0.73875745236695, -0.47128737436186, 0.15020273139707, -0.002176411421975, -0.021810755324761, -0.10829784403677, -0.046333324635812, 7.1280351959551E-05, 1.1032831789999E-04, 1.8955248387902E-04, 3.0891541160537E-03, 1.3555504554949E-03, 2.8640237477456E-07, -1.0779857357512E-05, -7.6462712454814E-05, 1.4052392818316E-05, -3.1083814331434E-05, -1.0302738212103E-06, 2.821728163504E-07, 1.2704902271945E-06, 7.3803353468292E-08, -1.1030139238909E-08, -8.1456365207833E-14, -2.5180545682962E-11, -1.7565233969407E-18, 8.6934156344163E-15]

const T2_ph_B = (p: number, h: number) => {
  const hs = h / 2000
  let Ts = 0
  for (let i = 0; i <= 37; i += 1)
    Ts +=
      T2_ph_B_ni[i] *
      (p - 2) ** T2_ph_B_Ii[i] *
      (hs - 2.6) ** T2_ph_B_Ji[i]
  return Ts
}

// Subregion C
// Table 22, Eq 24, page 24
const T2_ph_C_Ji = [0, 4, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 4, 8, 4, 0, 1, 4, 10, 12, 16, 20, 22]
const T2_ph_C_Ii = [-7, -7, -6, -6, -5, -5, -2, -2, -1, -1, 0, 0, 1, 1, 2, 6, 6, 6, 6, 6, 6, 6, 6]
const T2_ph_C_ni = [-3236839855524.2, 7326335090218.1, 358250899454.47, -583401318515.9, -10783068217.47, 20825544563.171, 610747.83564516, 859777.2253558, -25745.72360417, 31081.088422714, 1208.2315865936, 482.19755109255, 3.7966001272486, -10.842984880077, -0.04536417267666, 1.4559115658698E-13, 1.126159740723E-12, -1.7804982240686E-11, 1.2324579690832E-07, -1.1606921130984E-06, 2.7846367088554E-05, -5.9270038474176E-04, 1.2918582991878E-03]

const T2_ph_C = (p: number, h: number) => {
  const hs = h / 2000
  let Ts = 0
  for (let i = 0; i <= 22; i += 1)
    Ts +=
      T2_ph_C_ni[i] *
      (p + 25) ** T2_ph_C_Ii[i] *
      (hs - 1.8) ** T2_ph_C_Ji[i]
  return Ts
}

// Revised Supplementary Release on Backward Equations for the Functions T(p,h), v(p,h) and T(p,s), v(p,s)
// for Region 3 of the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 2004
// Section 3.3 Backward Equations T(p,h) and v(p,h) for Subregions 3a and 3b
// Boundary equation, Eq 1 Page 5
const T3_ph = (p: number, h: number) => {
  const h3ab =
    2014.64004206875 +
    3.74696550136983 * p -
    2.19921901054187E-02 * p ** 2 +
    8.7513168600995E-05 * p ** 3

  // Subregion 3a
  if (h < h3ab) return T3_ph_A(p, h)
  // Subregion 3b
  return T3_ph_B(p, h)
}

// Subregion 3a
// Eq 2, Table 3, Page 7
const T3_ph_A_Ii = [-12, -12, -12, -12, -12, -12, -12, -12, -10, -10, -10, -8, -8, -8, -8, -5, -3, -2, -2, -2, -1, -1, 0, 0, 1, 3, 3, 4, 4, 10, 12]
const T3_ph_A_Ji = [0, 1, 2, 6, 14, 16, 20, 22, 1, 5, 12, 0, 2, 4, 10, 2, 0, 1, 3, 4, 0, 2, 0, 1, 1, 0, 1, 0, 3, 4, 5]
const T3_ph_A_ni = [-1.33645667811215E-07, 4.55912656802978E-06, -1.46294640700979E-05, 6.3934131297008E-03, 372.783927268847, -7186.54377460447, 573494.7521034, -2675693.29111439, -3.34066283302614E-05, -2.45479214069597E-02, 47.8087847764996, 7.64664131818904E-06, 1.28350627676972E-03, 1.71219081377331E-02, -8.51007304583213, -1.36513461629781E-02, -3.84460997596657E-06, 3.37423807911655E-03, -0.551624873066791, 0.72920227710747, -9.92522757376041E-03, -0.119308831407288, 0.793929190615421, 0.454270731799386, 0.20999859125991, -6.42109823904738E-03, -0.023515586860454, 2.52233108341612E-03, -7.64885133368119E-03, 1.36176427574291E-02, -1.33027883575669E-02]

const T3_ph_A = (p: number, h: number) => {
  const ps = p / 100
  const hs = h / 2300
  let Ts = 0
  for (let i = 0; i <= 30; i += 1)
    Ts +=
      T3_ph_A_ni[i] *
      (ps + 0.24) ** T3_ph_A_Ii[i] *
      (hs - 0.615) ** T3_ph_A_Ji[i]
  return Ts * 760
}

// Subregion 3b
// Eq 3, Table 4, Page 7,8
const T3_ph_B_Ii = [-12, -12, -10, -10, -10, -10, -10, -8, -8, -8, -8, -8, -6, -6, -6, -4, -4, -3, -2, -2, -1, -1, -1, -1, -1, -1, 0, 0, 1, 3, 5, 6, 8]
const T3_ph_B_Ji = [0, 1, 0, 1, 5, 10, 12, 0, 1, 2, 4, 10, 0, 1, 2, 0, 1, 5, 0, 4, 2, 4, 6, 10, 14, 16, 0, 2, 1, 1, 1, 1, 1]
const T3_ph_B_ni = [3.2325457364492E-05, -1.27575556587181E-04, -4.75851877356068E-04, 1.56183014181602E-03, 0.105724860113781, -85.8514221132534, 724.140095480911, 2.96475810273257E-03, -5.92721983365988E-03, -1.26305422818666E-02, -0.115716196364853, 84.9000969739595, -1.08602260086615E-02, 1.54304475328851E-02, 7.50455441524466E-02, 2.52520973612982E-02, -6.02507901232996E-02, -3.07622221350501, -5.74011959864879E-02, 5.03471360939849, -0.925081888584834, 3.91733882917546, -77.314600713019, 9493.08762098587, -1410437.19679409, 8491662.30819026, 0.861095729446704, 0.32334644281172, 0.873281936020439, -0.436653048526683, 0.286596714529479, -0.131778331276228, 6.76682064330275E-03]

const T3_ph_B = (p: number, h: number) => {
  const hs = h / 2800
  const ps = p / 100
  let Ts = 0
  for (let i = 0; i <= 32; i += 1)
    Ts +=
      T3_ph_B_ni[i] *
      (ps + 0.298) ** T3_ph_B_Ii[i] *
      (hs - 0.72) ** T3_ph_B_Ji[i]
  return Ts * 860
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// Section 8.2 The Saturation-Temperature Equation
// Eq 31, Page 34
const T4_p = (p: number) => {
  const beta = p ** 0.25
  const e =
    beta ** 2 - 17.073846940092 *
    beta + 14.91510861353
  const f =
    1167.0521452767 * beta ** 2 +
    12020.82470247 * beta -
    4823.2657361591
  const g =
    -724213.16703206 * beta ** 2 -
    3232555.0322333 * beta +
    405113.40542057
  const d = 2 * g / (-f - (f ** 2 - 4 * e * g) ** 0.5)
  return (650.17534844798 + d - ((650.17534844798 + d) ** 2 - 4 * (-0.23855557567849 + 650.17534844798 * d)) ** 0.5) / 2
}

const T5_ph = (p: number, h: number) => {
  // Solve with half interval method
  let low_bound = 1073.15, high_bound = 2273.15, Ts = 0
  let hs = 0
  while (Math.abs(h - hs) > 0.00001) {
    Ts = (low_bound + high_bound) / 2
    hs = h5_pT(p, Ts)
    if (hs > h)
      high_bound = Ts
    else
      low_bound = Ts
  }
  return Ts
}

const T1_ps_I1 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4]
const T1_ps_J1 = [0, 1, 2, 3, 11, 31, 0, 1, 2, 3, 12, 31, 0, 1, 2, 9, 31, 10, 32, 32]
const T1_ps_n1 = [174.78268058307, 34.806930892873, 6.5292584978455, 0.33039981775489, -1.9281382923196E-07, -2.4909197244573E-23, -0.26107636489332, 0.22592965981586, -0.064256463395226, 7.8876289270526E-03, 3.5672110607366E-10, 1.7332496994895E-24, 5.6608900654837E-04, -3.2635483139717E-04, 4.4778286690632E-05, -5.1322156908507E-10, -4.2522657042207E-26, 2.6400441360689E-13, 7.8124600459723E-29, -3.0732199903668E-31]

const T1_ps = (p: number, s: number) => {
  let res = 0
  for (let i = 0; i <= 19; i += 1)
    res +=
      T1_ps_n1[i] *
      p ** T1_ps_I1[i] *
      (s + 2) ** T1_ps_J1[i]
  return res
}

// Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam, September 1997
// 6 Equations for Region 2,6.3.2 The Backward Equations T( p, s ) for Subregions 2a, 2b, and 2c
// Page 26
const T2_ps = (p: number, s: number) => {
  // Subregion A
  if (p < 4) return T2_ps_A(p, s)
  // Subregion C
  if (s < 5.85) return T2_ps_C(p, s)
  // Subregion B
  return T2_ps_B(p, s)
}

// Subregion A
// Table 25, Eq 25, page 26
const T2_ps_A_Ii = [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.25, -1.25, -1.25, -1, -1, -1, -1, -1, -1, -0.75, -0.75, -0.5, -0.5, -0.5, -0.5, -0.25, -0.25, -0.25, -0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75, 0.75, 1, 1, 1.25, 1.25, 1.5, 1.5]
const T2_ps_A_Ji = [-24, -23, -19, -13, -11, -10, -19, -15, -6, -26, -21, -17, -16, -9, -8, -15, -14, -26, -13, -9, -7, -27, -25, -11, -6, 1, 4, 8, 11, 0, 1, 5, 6, 10, 14, 16, 0, 4, 9, 17, 7, 18, 3, 15, 5, 18]
const T2_ps_A_ni = [-392359.83861984, 515265.7382727, 40482.443161048, -321.93790923902, 96.961424218694, -22.867846371773, -449429.14124357, -5011.8336020166, 0.35684463560015, 44235.33584819, -13673.388811708, 421632.60207864, 22516.925837475, 474.42144865646, -149.31130797647, -197811.26320452, -23554.39947076, -19070.616302076, 55375.669883164, 3829.3691437363, -603.91860580567, 1936.3102620331, 4266.064369861, -5978.0638872718, -704.01463926862, 338.36784107553, 20.862786635187, 0.033834172656196, -4.3124428414893E-05, 166.53791356412, -139.86292055898, -0.78849547999872, 0.072132411753872, -5.9754839398283E-03, -1.2141358953904E-05, 2.3227096733871E-07, -10.538463566194, 2.0718925496502, -0.072193155260427, 2.074988708112E-07, -0.018340657911379, 2.9036272348696E-07, 0.21037527893619, 2.5681239729999E-04, -0.012799002933781, -8.2198102652018E-06]

const T2_ps_A = (p: number, s: number) => {
  const sigma = s / 2
  let teta = 0
  for (let i = 0; i <= 45; i += 1)
    teta +=
      T2_ps_A_ni[i] *
      p ** T2_ps_A_Ii[i] *
      (sigma - 2) ** T2_ps_A_Ji[i]
  return teta
}

// Subregion B
// Table 26, Eq 26, page 27
const T2_ps_B_Ii = [-6, -6, -5, -5, -4, -4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5]
const T2_ps_B_Ji = [0, 11, 0, 11, 0, 1, 11, 0, 1, 11, 12, 0, 1, 6, 10, 0, 1, 5, 8, 9, 0, 1, 2, 4, 5, 6, 9, 0, 1, 2, 3, 7, 8, 0, 1, 5, 0, 1, 3, 0, 1, 0, 1, 2]
const T2_ps_B_ni = [316876.65083497, 20.864175881858, -398593.99803599, -21.816058518877, 223697.85194242, -2784.1703445817, 9.920743607148, -75197.512299157, 2970.8605951158, -3.4406878548526, 0.38815564249115, 17511.29508575, -1423.7112854449, 1.0943803364167, 0.89971619308495, -3375.9740098958, 471.62885818355, -1.9188241993679, 0.41078580492196, -0.33465378172097, 1387.0034777505, -406.63326195838, 41.72734715961, 2.1932549434532, -1.0320050009077, 0.35882943516703, 5.2511453726066E-03, 12.838916450705, -2.8642437219381, 0.56912683664855, -0.099962954584931, -3.2632037778459E-03, 2.3320922576723E-04, -0.1533480985745, 0.029072288239902, 3.7534702741167E-04, 1.7296691702411E-03, -3.8556050844504E-04, -3.5017712292608E-05, -1.4566393631492E-05, 5.6420857267269E-06, 4.1286150074605E-08, -2.0684671118824E-08, 1.6409393674725E-09]

const T2_ps_B = (p: number, s: number) => {
  const sigma = s / 0.7853
  let teta = 0
  for (let i = 0; i <= 43; i += 1)
    teta +=
      T2_ps_B_ni[i] *
      p ** T2_ps_B_Ii[i] *
      (10 - sigma) ** T2_ps_B_Ji[i]
  return teta
}

// Subregion C
// Table 27, Eq 27, page 28
const T2_ps_C_Ii = [-2, -2, -1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 7]
const T2_ps_C_Ji = [0, 1, 0, 0, 1, 2, 3, 0, 1, 3, 4, 0, 1, 2, 0, 1, 5, 0, 1, 4, 0, 1, 2, 0, 1, 0, 1, 3, 4, 5]
const T2_ps_C_ni = [909.68501005365, 2404.566708842, -591.6232638713, 541.45404128074, -270.98308411192, 979.76525097926, -469.66772959435, 14.399274604723, -19.104204230429, 5.3299167111971, -21.252975375934, -0.3114733441376, 0.60334840894623, -0.042764839702509, 5.8185597255259E-03, -0.014597008284753, 5.6631175631027E-03, -7.6155864584577E-05, 2.2440342919332E-04, -1.2561095013413E-05, 6.3323132660934E-07, -2.0541989675375E-06, 3.6405370390082E-08, -2.9759897789215E-09, 1.0136618529763E-08, 5.9925719692351E-12, -2.0677870105164E-11, -2.0874278181886E-11, 1.0162166825089E-10, -1.6429828281347E-10]

const T2_ps_C = (p: number, s: number) => {
  const sigma = s / 2.9251
  let teta = 0
  for (let i = 0; i <= 29; i += 1)
    teta +=
      T2_ps_C_ni[i] *
      p ** T2_ps_C_Ii[i] *
      (2 - sigma) ** T2_ps_C_Ji[i]
  return teta
}

// Revised Supplementary Release on Backward Equations for the Functions T(p,h), v(p,h) and T(p,s), v(p,s) for Region 3 of the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 2004
// 3.4 Backward Equations T(p,s) and v(p,s) for Subregions 3a and 3b
// Boundary equation, Eq 6 Page 11
const T3_ps = (p: number, s: number) => {
  // Subregion 3a
  if (s <= 4.41202148223476) return T3_ps_A(p, s)
  // Subregion 3b
  return T3_ps_B(p, s)
}

// Subregion 3a
// Eq 6, Table 10, Page 11
const T3_ps_A_Ii = [-12, -12, -10, -10, -10, -10, -8, -8, -8, -8, -6, -6, -6, -5, -5, -5, -4, -4, -4, -2, -2, -1, -1, 0, 0, 0, 1, 2, 2, 3, 8, 8, 10]
const T3_ps_A_Ji = [28, 32, 4, 10, 12, 14, 5, 7, 8, 28, 2, 6, 32, 0, 14, 32, 6, 10, 36, 1, 4, 1, 6, 0, 1, 4, 0, 0, 3, 2, 0, 1, 2]
const T3_ps_A_ni = [1500420082.63875, -159397258480.424, 5.02181140217975E-04, -67.2057767855466, 1450.58545404456, -8238.8953488889, -0.154852214233853, 11.2305046746695, -29.7000213482822, 43856513263.5495, 1.37837838635464E-03, -2.97478527157462, 9717779473494.13, -5.71527767052398E-05, 28830.794977842, -74442828926270.3, 12.8017324848921, -368.275545889071, 6.64768904779177E+15, 0.044935925195888, -4.22897836099655, -0.240614376434179, -4.74341365254924, 0.72409399912611, 0.923874349695897, 3.99043655281015, 3.84066651868009E-02, -3.59344365571848E-03, -0.735196448821653, 0.188367048396131, 1.41064266818704E-04, -2.57418501496337E-03, 1.23220024851555E-03]

const T3_ps_A = (p: number, s: number) => {
  const sigma = s / 4.4
  const ps = p / 100
  let teta = 0
  for (let i = 0; i <= 32; i += 1)
    teta += T3_ps_A_ni[i] * (ps + 0.24) ** T3_ps_A_Ii[i] * (sigma - 0.703) ** T3_ps_A_Ji[i]
  return teta * 760
}

// Subregion 3b
// Eq 7, Table 11, Page 11
const T3_ps_B_Ii = [-12, -12, -12, -12, -8, -8, -8, -6, -6, -6, -5, -5, -5, -5, -5, -4, -3, -3, -2, 0, 2, 3, 4, 5, 6, 8, 12, 14]
const T3_ps_B_Ji = [1, 3, 4, 7, 0, 1, 3, 0, 2, 4, 0, 1, 2, 4, 6, 12, 1, 6, 2, 0, 1, 1, 0, 24, 0, 3, 1, 2]
const T3_ps_B_ni = [0.52711170160166, -40.1317830052742, 153.020073134484, -2247.99398218827, -0.193993484669048, -1.40467557893768, 42.6799878114024, 0.752810643416743, 22.6657238616417, -622.873556909932, -0.660823667935396, 0.841267087271658, -25.3717501764397, 485.708963532948, 880.531517490555, 2650155.92794626, -0.359287150025783, -656.991567673753, 2.41768149185367, 0.856873461222588, 0.655143675313458, -0.213535213206406, 5.62974957606348E-03, -316955725450471, -6.99997000152457E-04, 1.19845803210767E-02, 1.93848122022095E-05, -2.15095749182309E-05]

const T3_ps_B = (p: number, s: number) => {
  const sigma = s / 5.3
  const ps = p / 100
  let teta = 0
  for (let i = 0; i <= 27; i += 1)
    teta +=
      T3_ps_B_ni[i] *
      (ps + 0.76) ** T3_ps_B_Ii[i] *
      (sigma - 0.818) ** T3_ps_B_Ji[i]
  return teta * 860
}

const T5_ps = (p: number, s: number) => {
  let Low_Bound = 1073.15, High_Bound = 2273.15, Ts = 0
  let ss = 0
  while (Math.abs(s - ss) > 0.00001) {
    Ts = (Low_Bound + High_Bound) / 2
    ss = s5_pT(p, Ts)
    if (ss > s)
      High_Bound = Ts
    else
      Low_Bound = Ts
  }
  return Ts
}

// Revised Supplementary Release on Backward Equations for the Functions T(p,h), v(p,h) and T(p,s), v(p,s)
// for Region 3 of the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 2004
// Section 3.3 Backward Equations T(p,h) and v(p,h) for Subregions 3a and 3b
// Boundary equation, Eq 1 Page 5
const v3_ph = (p: number, h: number) => {
  const h3ab =
    2014.64004206875 +
    3.74696550136983 * p -
    2.19921901054187E-02 * p ** 2 +
    8.7513168600995E-05 * p ** 3
  // Subregion 3a
  if (h < h3ab) return v3_ph_A(p, h)
  // Subregion 3b
  return v3_ph_B(p, h)
}

// Subregion 3a
// Eq 4, Table 6, Page 9
const v3_ph_A_Ii = [-12, -12, -12, -12, -10, -10, -10, -8, -8, -6, -6, -6, -4, -4, -3, -2, -2, -1, -1, -1, -1, 0, 0, 1, 1, 1, 2, 2, 3, 4, 5, 8]
const v3_ph_A_Ji = [6, 8, 12, 18, 4, 7, 10, 5, 12, 3, 4, 22, 2, 3, 7, 3, 16, 0, 1, 2, 3, 0, 1, 0, 1, 2, 0, 2, 0, 2, 2, 2]
const v3_ph_A_ni = [5.29944062966028E-03, -0.170099690234461, 11.1323814312927, -2178.98123145125, -5.06061827980875E-04, 0.556495239685324, -9.43672726094016, -0.297856807561527, 93.9353943717186, 1.92944939465981E-02, 0.421740664704763, -3689141.2628233, -7.37566847600639E-03, -0.354753242424366, -1.99768169338727, 1.15456297059049, 5683.6687581596, 8.08169540124668E-03, 0.172416341519307, 1.04270175292927, -0.297691372792847, 0.560394465163593, 0.275234661176914, -0.148347894866012, -6.51142513478515E-02, -2.92468715386302, 6.64876096952665E-02, 3.52335014263844, -1.46340792313332E-02, -2.24503486668184, 1.10533464706142, -4.08757344495612E-02]

const v3_ph_A = (p: number, h: number) => {
  const ps = p / 100
  const hs = h / 2100
  let vs = 0
  for (let i = 0; i <= 31; i += 1)
    vs +=
      v3_ph_A_ni[i] *
      (ps + 0.128) ** v3_ph_A_Ii[i] *
      (hs - 0.727) ** v3_ph_A_Ji[i]
  return vs * 0.0028
}

// Subregion 3b
// Eq 5, Table 7, Page 9
const v3_ph_B_Ii = [-12, -12, -8, -8, -8, -8, -8, -8, -6, -6, -6, -6, -6, -6, -4, -4, -4, -3, -3, -2, -2, -1, -1, -1, -1, 0, 1, 1, 2, 2]
const v3_ph_B_Ji = [0, 1, 0, 1, 3, 6, 7, 8, 0, 1, 2, 5, 6, 10, 3, 6, 10, 0, 2, 1, 2, 0, 1, 4, 5, 0, 0, 1, 2, 6]
const v3_ph_B_ni = [-2.25196934336318E-09, 1.40674363313486E-08, 2.3378408528056E-06, -3.31833715229001E-05, 1.07956778514318E-03, -0.271382067378863, 1.07202262490333, -0.853821329075382, -2.15214194340526E-05, 7.6965608822273E-04, -4.31136580433864E-03, 0.453342167309331, -0.507749535873652, -100.475154528389, -0.219201924648793, -3.21087965668917, 607.567815637771, 5.57686450685932E-04, 0.18749904002955, 9.05368030448107E-03, 0.285417173048685, 3.29924030996098E-02, 0.239897419685483, 4.82754995951394, -11.8035753702231, 0.169490044091791, -1.79967222507787E-02, 3.71810116332674E-02, -5.36288335065096E-02, 1.6069710109252]

const v3_ph_B = (p: number, h: number) => {
  const ps = p / 100
  const hs = h / 2800
  let vs = 0
  for (let i = 0; i <= 29; i += 1)
    vs +=
      v3_ph_B_ni[i] *
      (ps + 0.0661) ** v3_ph_B_Ii[i] *
      (hs - 0.72) ** v3_ph_B_Ji[i]
  return vs * 0.0088
}

// Revised Supplementary Release on Backward Equations for the Functions T(p,h), v(p,h) and T(p,s), v(p,s) for Region 3 of the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam 2004
// 3.4 Backward Equations T(p,s) and v(p,s) for Subregions 3a and 3b
// Boundary equation, Eq 6 Page 11
const v3_ps = (p: number, s: number) => {
  // Subregion 3a
  if (s <= 4.41202148223476) return v3_ps_A(p, s)
  // Subregion 3b
  return v3_ps_B(p, s)
}

// Subregion 3a
// Eq 8, Table 13, Page 14
const v3_ps_A_Ii = [-12, -12, -12, -10, -10, -10, -10, -8, -8, -8, -8, -6, -5, -4, -3, -3, -2, -2, -1, -1, 0, 0, 0, 1, 2, 4, 5, 6]
const v3_ps_A_Ji = [10, 12, 14, 4, 8, 10, 20, 5, 6, 14, 16, 28, 1, 5, 2, 4, 3, 8, 1, 2, 0, 1, 3, 0, 0, 2, 2, 0]
const v3_ps_A_ni = [79.5544074093975, -2382.6124298459, 17681.3100617787, -1.10524727080379E-03, -15.3213833655326, 297.544599376982, -35031520.6871242, 0.277513761062119, -0.523964271036888, -148011.182995403, 1600148.99374266, 1708023226634.27, 2.46866996006494E-04, 1.6532608479798, -0.118008384666987, 2.537986423559, 0.965127704669424, -28.2172420532826, 0.203224612353823, 1.10648186063513, 0.52612794845128, 0.277000018736321, 1.08153340501132, -7.44127885357893E-02, 1.64094443541384E-02, -6.80468275301065E-02, 0.025798857610164, -1.45749861944416E-04]

const v3_ps_A = (p: number, s: number) => {
  const ps = p / 100
  const sigma = s / 4.4
  let omega = 0
  for (let i = 0; i <= 27; i += 1)
    omega +=
      v3_ps_A_ni[i] *
      (ps + 0.187) ** v3_ps_A_Ii[i] *
      (sigma - 0.755) ** v3_ps_A_Ji[i]
  return omega * 0.0028
}

// Subregion 3b
// Eq 9, Table 14, Page 14
const v3_ps_B_Ii = [-12, -12, -12, -12, -12, -12, -10, -10, -10, -10, -8, -5, -5, -5, -4, -4, -4, -4, -3, -2, -2, -2, -2, -2, -2, 0, 0, 0, 1, 1, 2]
const v3_ps_B_Ji = [0, 1, 2, 3, 5, 6, 0, 1, 2, 4, 0, 1, 2, 3, 0, 1, 2, 3, 1, 0, 1, 2, 3, 4, 12, 0, 1, 2, 0, 2, 2]
const v3_ps_B_ni = [5.91599780322238E-05, -1.85465997137856E-03, 1.04190510480013E-02, 5.9864730203859E-03, -0.771391189901699, 1.72549765557036, -4.67076079846526E-04, 1.34533823384439E-02, -8.08094336805495E-02, 0.508139374365767, 1.28584643361683E-03, -1.63899353915435, 5.86938199318063, -2.92466667918613, -6.14076301499537E-03, 5.76199014049172, -12.1613320606788, 1.67637540957944, -7.44135838773463, 3.78168091437659E-02, 4.01432203027688, 16.0279837479185, 3.17848779347728, -3.58362310304853, -1159952.60446827, 0.199256573577909, -0.122270624794624, -19.1449143716586, -1.50448002905284E-02, 14.6407900162154, -3.2747778718823]

const v3_ps_B = (p: number, s: number) => {
  const ps = p / 100
  const sigma = s / 5.3
  let omega = 0
  for (let i = 0; i <= 30; i += 1)
    omega +=
      v3_ps_B_ni[i] *
      (ps + 0.298) ** v3_ps_B_Ii[i] *
      (sigma - 0.816) ** v3_ps_B_Ji[i]
  return omega * 0.0088
}

const x4_ps = (p: number, s: number) => {
  let ssV, ssL
  if (p < 16.529) {
    ssV = s2_pT(p, T4_p(p))
    ssL = s1_pT(p, T4_p(p))
  } else {
    ssV = s3_rhoT(1 / v3_ph(p, h4V_p(p)), T4_p(p))
    ssL = s3_rhoT(1 / v3_ph(p, h4L_p(p)), T4_p(p))
  }
  if (s < ssL) return 0
  if (s > ssV) return 1
  return (s - ssL) / (s - ssV)
}

// Regions as a function of ph
const region_ph = (p: number, h: number) => {
  // Check if outside pressure limits
  if (p < 0.000611657 || p > 100) return 0
  // Check if outside low h
  if (
    h < 0.963 * p + 2.2 && // Linear adaption to h1_pt(...) + 2 to speed up calcualations
    h < h1_pT(p, 273.15)
  ) return 0
  if (p < 16.5292) {
    // Below region 3, Check region 1, 4, 2, 5
    const Ts = T4_p(p)
    // Check Region 1
    let hL = 109.6635 * Math.log(p) + 40.3481 * p + 734.58 // Approximate function for hL_p
    if (Math.abs(h - hL) < 100) // If approximate is not god enough use real function
      hL = h1_pT(p, Ts)
    if (h <= hL) return 1
    // Check Region 4
    let hV = 45.1768 * Math.log(p) - 20.158 * p + 2804.4 // Approximate function for hV_p
    if (Math.abs(h - hV) < 50) // If approximate is not god enough use real function
      hV = h2_pT(p, Ts)
    if (h < hV) return 4
    // Check upper limit of region 2 Quick Test
    if (h < 4000) return 2
    // Check region 2 (Real value)
    if (h <= h2_pT(p, 1073.15)) return 2
    // Check region 5
    if (p <= 10 && h < h5_pT(p, 2273.15)) return 5
    return 0
  }

  // For p > 16.5292
  if (h < h1_pT(p, 623.15)) return 1
  // Check if in region 3 or 4 (Bellow Reg 2)
  if (h < h2_pT(p, B23T_p(p))) {
    // Region 3 or 4
    if (p > p3sat_h(h)) return 3
    return 4
  }
  // Check if region 2
  if (h < h2_pT(p, 1073.15)) return 2

  return 0
}

// Regions as a function of ps
const region_ps = (p: number, s: number) => {
  if (
    p < 0.000611657 ||
    p > 100 ||
    s < 0 ||
    s > s5_pT(p, 2273.15)
  ) return 0
  // Check region 5
  if (s > s2_pT(p, 1073.15)) {
    if (p <= 10) return 5
    return 0
  }
  let ss
  // Check region 2
  if (p > 16.529)
    ss = s2_pT(p, B23T_p(p)) // Between 5.047 and 5.261. Use to speed up!
  else
    ss = s2_pT(p, T4_p(p))
  if (s > ss) return 2
  // Check region 3
  ss = s1_pT(p, 623.15)
  if (p > 16.529 && s > ss) {
    if (p > p3sat_s(s)) return 3
    return 4
  }
  // Check region 4 (Not inside region 3)
  if (
    p < 16.529 &&
    s > s1_pT(p, T4_p(p))
  ) return 4
  // Check region 1
  // p > 0.000611657 And s > s1_pT(p, 273.15)
  return 1
}

// Regions as a function of pT
const region_pT = (p: number, T: number) => {
  if (T > 1073.15 && p < 10 && T < 2273.15 && p > 0.000611) return 5
  if (T <= 1073.15 && T > 273.15 && p <= 100 && p > 0.000611)
    if (T > 623.15) {
      if (p > B23p_T(T)) {
        if (T < 647.096) {
          const ps = p4_T(T)
          if (Math.abs(p - ps) < 0.00001) return 4
        }
        return 3
      }
      return 2
    } else {
      const ps = p4_T(T)
      if (Math.abs(p - ps) < 0.00001) return 4
      if (p > ps) return 1
      return 2
    }
  return 0
}
