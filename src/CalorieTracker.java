package src;
import java.util.*;

public class CalorieTracker {

    // Food database: name -> [calories, protein, carbs, fat] per 100g
    static Map<String, double[]> foodDB = new HashMap<>();

    static {
        foodDB.put("chicken breast",   new double[]{165, 31.0, 0.0,  3.6});
        foodDB.put("rice",             new double[]{130, 2.7,  28.2, 0.3});
        foodDB.put("egg",              new double[]{155, 13.0, 1.1,  11.0});
        foodDB.put("banana",           new double[]{89,  1.1,  23.0, 0.3});
        foodDB.put("oats",             new double[]{389, 17.0, 66.0, 7.0});
        foodDB.put("milk",             new double[]{61,  3.2,  4.8,  3.3});
        foodDB.put("bread",            new double[]{265, 9.0,  49.0, 3.2});
        foodDB.put("apple",            new double[]{52,  0.3,  14.0, 0.2});
        foodDB.put("salmon",           new double[]{208, 20.0, 0.0,  13.0});
        foodDB.put("broccoli",         new double[]{34,  2.8,  7.0,  0.4});
        foodDB.put("paneer",           new double[]{265, 18.3, 1.2,  20.8});
        foodDB.put("dal",              new double[]{116, 9.0,  20.0, 0.4});
        foodDB.put("roti",             new double[]{297, 9.0,  55.0, 4.0});
        foodDB.put("potato",           new double[]{77,  2.0,  17.0, 0.1});
        foodDB.put("peanut butter",    new double[]{588, 25.0, 20.0, 50.0});
        foodDB.put("greek yogurt",     new double[]{59,  10.0, 3.6,  0.4});
        foodDB.put("almonds",          new double[]{579, 21.0, 22.0, 50.0});
        foodDB.put("curd",             new double[]{98,  11.0, 3.4,  4.3});
        foodDB.put("white rice",       new double[]{130, 2.7,  28.2, 0.3});
        foodDB.put("brown rice",       new double[]{216, 5.0,  45.0, 1.8});
    }

    static List<String> log = new ArrayList<>();
    static double totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== CALORIE TRACKER (Java CLI) ===");
        System.out.println("Type 'list' to see foods, 'total' for daily summary, 'quit' to exit.\n");

        while (true) {
            System.out.print("Enter food name: ");
            String food = sc.nextLine().trim().toLowerCase();

            if (food.equals("quit")) break;
            if (food.equals("list")) { listFoods(); continue; }
            if (food.equals("total")) { printTotal(); continue; }

            if (!foodDB.containsKey(food)) {
                System.out.println("  [!] Food not found. Try 'list' to see available foods.\n");
                continue;
            }

            System.out.print("Enter amount (grams): ");
            double grams;
            try {
                grams = Double.parseDouble(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("  [!] Invalid amount.\n");
                continue;
            }

            double[] data = foodDB.get(food);
            double factor = grams / 100.0;
            double cal  = data[0] * factor;
            double prot = data[1] * factor;
            double carb = data[2] * factor;
            double fat  = data[3] * factor;

            totalCal     += cal;
            totalProtein += prot;
            totalCarbs   += carb;
            totalFat     += fat;

            String entry = String.format("%s (%.0fg)", food, grams);
            log.add(entry);

            System.out.printf("  ✓ Added: %s%n", entry);
            System.out.printf("    Calories: %.1f kcal | Protein: %.1fg | Carbs: %.1fg | Fat: %.1fg%n%n",
                cal, prot, carb, fat);
        }

        printTotal();
        sc.close();
    }

    static void listFoods() {
        System.out.println("\n  Available foods:");
        List<String> sorted = new ArrayList<>(foodDB.keySet());
        Collections.sort(sorted);
        for (String f : sorted) System.out.println("  - " + f);
        System.out.println();
    }

    static void printTotal() {
        System.out.println("\n========== DAILY TOTAL ==========");
        if (log.isEmpty()) { System.out.println("  No foods logged yet.\n"); return; }
        System.out.println("  Foods logged:");
        for (String e : log) System.out.println("   • " + e);
        System.out.printf("%n  Total Calories : %.1f kcal%n", totalCal);
        System.out.printf("  Total Protein  : %.1f g%n", totalProtein);
        System.out.printf("  Total Carbs    : %.1f g%n", totalCarbs);
        System.out.printf("  Total Fat      : %.1f g%n%n", totalFat);
    }
}
