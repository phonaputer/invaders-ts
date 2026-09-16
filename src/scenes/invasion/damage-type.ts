enum DamageType {
  Alien = 1,
  AlienProjectile = 1 << 1,
  Player = 1 << 2,
  PlayerProjectile = 1 << 3,
  Fortress = 1 << 4,
}

export default DamageType;
